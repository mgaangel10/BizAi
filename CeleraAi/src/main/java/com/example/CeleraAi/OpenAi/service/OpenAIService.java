package com.example.CeleraAi.OpenAi.service;

import com.example.CeleraAi.Negocio.model.Negocio;
import com.example.CeleraAi.Negocio.repositorio.NegocioRepo;
import com.example.CeleraAi.Producto.model.Producto;
import com.example.CeleraAi.Producto.repositorio.ProductoRepo;
import com.example.CeleraAi.Venta.Dto.VentaDto;
import com.example.CeleraAi.Venta.model.DetalleVenta;
import com.example.CeleraAi.Venta.model.Venta;
import com.example.CeleraAi.Venta.service.VentaService;
import com.example.CeleraAi.users.model.Usuario;
import com.example.CeleraAi.users.repositorio.UsuarioRepo;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OpenAIService {

    private static final String API_URL = "https://api.openai.com/v1/chat/completions";
    private static final String API_KEY = "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"; // ¡Recuerda nunca compartir tu API key!
    private final UsuarioRepo usuarioRepo;
    private final VentaService ventaService;
    private final NegocioRepo negocioRepo;
    private final ProductoRepo productoRepo;

    public String generarTextoConIA(String mensajeUsuario) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            String nombre = ((UserDetails) principal).getUsername();
            Optional<Usuario> usuario = usuarioRepo.findByEmailIgnoreCase(nombre);

            if (usuario.isPresent()) {
                // Llamada al método para consultar OpenAI
                return consultarAPIOpenAI(mensajeUsuario);
            }
        }

        return "No se encontró al usuario.";
    }

    public String generarRecomendaciones(String mensajeUsuario, UUID idNegocio) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            String nombre = ((UserDetails) principal).getUsername();
            Optional<Usuario> usuario = usuarioRepo.findByEmailIgnoreCase(nombre);
            Optional<Negocio> negocio = negocioRepo.findById(idNegocio);

            if (usuario.isPresent() && negocio.isPresent()) {
                // Obtener las ventas y productos del negocio
                List<Venta> ventas = negocio.get().getVentas();
                List<Producto> productos = negocio.get().getProdcutos();

                // Construir el mensaje para las ventas
                StringBuilder ventasInfo = new StringBuilder("Ventas del usuario:\n");
                for (Venta venta : ventas) {
                    for (DetalleVenta detalle : venta.getDetalleVentas()) {
                        Producto producto = detalle.getProdcuto();
                        ventasInfo.append("Producto: ").append(producto.getNombre())
                                .append(", Cantidad: ").append(detalle.getCantidad())
                                .append(", Precio: ").append(producto.getPrecio())
                                .append(", Fecha: ").append(venta.getFecha())
                                .append("\n");
                    }
                }

                if (ventas.isEmpty()) {
                    ventasInfo.append("El usuario no tiene ventas registradas.");
                }

                // Construir el mensaje para los productos disponibles
                StringBuilder productosInfo = new StringBuilder("Productos disponibles:\n");
                for (Producto producto : productos) {
                    productosInfo.append("Producto: ").append(producto.getNombre())
                            .append(", Precio: ").append(producto.getPrecio())
                            .append(", Stock: ").append(producto.getStock())
                            .append(", Precio proveedor: ").append(producto.getPrecioProveedor())
                            .append("\n");
                }

                if (productos.isEmpty()) {
                    productosInfo.append("El usuario no tiene productos registrados.");
                }

                // Crear el mensaje final para enviar a OpenAI

                String mensaje = "Usuario: " + nombre + "\n" +
                        "Ventas: " + ventasInfo.toString() +
                        "Productos: " + productosInfo.toString() +
                        "Negocio"+ negocio.get().getCategorias()+
                        "\nBasado en la pregunta, "+mensajeUsuario;

                // Enviar mensaje a OpenAI
                System.out.println("Ventas: " + ventas.size());
                System.out.println("Productos: " + productos.size());

                return consultarAPIOpenAI(mensaje);
            }
        }

        return "No se encontró al usuario o negocio.";
    }

    public String generarRecomendacionesV2(String mensajeUsuario, UUID idNegocio) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            String nombre = ((UserDetails) principal).getUsername();
            Optional<Usuario> usuario = usuarioRepo.findByEmailIgnoreCase(nombre);
            Optional<Negocio> negocio = negocioRepo.findById(idNegocio);

            if (usuario.isPresent() && negocio.isPresent()) {
                List<Venta> ventas = negocio.get().getVentas();
                List<Producto> productos = negocio.get().getProdcutos();

                // Construcción del mensaje para OpenAI
                String mensaje = construirMensajeParaIA(nombre, ventas, productos, mensajeUsuario, negocio.get());

                // Consultar OpenAI y obtener la respuesta
                String respuestaIA = consultarAPIOpenAI(mensaje);

                // Procesar la respuesta para detectar acciones
                return procesarRespuestaIA(respuestaIA, negocio.get());
            }
        }

        return "No se encontró al usuario o negocio.";
    }


    private String construirMensajeParaIA(String nombre, List<Venta> ventas, List<Producto> productos, String mensajeUsuario, Negocio negocio) {
        StringBuilder ventasInfo = new StringBuilder("Ventas del usuario:\n");
        for (Venta venta : ventas) {
            for (DetalleVenta detalle : venta.getDetalleVentas()) {
                Producto producto = detalle.getProdcuto();
                ventasInfo.append("Producto: ").append(producto.getNombre())
                        .append(", Cantidad: ").append(detalle.getCantidad())
                        .append(", Precio: ").append(producto.getPrecio())
                        .append(", Fecha: ").append(venta.getFecha())
                        .append("\n");
            }
        }

        if (ventas.isEmpty()) {
            ventasInfo.append("No hay ventas registradas.");
        }

        StringBuilder productosInfo = new StringBuilder("Productos disponibles:\n");
        for (Producto producto : productos) {
            productosInfo.append("Producto: ").append(producto.getNombre())
                    .append(", Precio: ").append(producto.getPrecio())
                    .append(", Stock: ").append(producto.getStock())
                    .append("\n");
        }

        if (productos.isEmpty()) {
            productosInfo.append("No hay productos registrados.");
        }

        return "{ \"usuario\": \"" + nombre + "\", " +
                "\"ventas\": \"" + ventasInfo.toString() + "\", " +
                "\"productos\": \"" + productosInfo.toString() + "\", " +
                "\"negocio\": \"" + negocio.getCategorias() + "\", " +
                "\"pregunta\": \"" + mensajeUsuario + "\", " +
                "\"respuesta_formato\": \"json\" }";
    }

    private String procesarRespuestaIA(String respuestaIA, Negocio negocio) {
        try {
            // Convertir la respuesta de OpenAI en un JSON
            JSONObject jsonResponse = new JSONObject(respuestaIA);

            // Extraer el contenido de "choices[0].message.content"
            String contenidoIA = jsonResponse.getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content");

            // Convertir el contenido en JSON real
            JSONObject jsonRespuesta = new JSONObject(contenidoIA);

            String accion = jsonRespuesta.getString("accion");

            if ("crear_producto".equals(accion)) {
                String nombre = jsonRespuesta.getString("producto");
                double precio = jsonRespuesta.getDouble("precio");
                int stock = jsonRespuesta.getInt("stock");
                double precioProveedor = jsonRespuesta.getDouble("precioProveedor");

                Producto nuevoProducto = new Producto();
                nuevoProducto.setNombre(nombre);
                nuevoProducto.setStock(stock);
                nuevoProducto.setPrecio(precio);
                nuevoProducto.setPrecioProveedor(precioProveedor);
                nuevoProducto.setNegocio(negocio);
                productoRepo.save(nuevoProducto);

                return "✅ Producto añadido con éxito: " + nombre;
            }
        } catch (JSONException e) {
            e.printStackTrace();
            return "⚠ Error al procesar la respuesta de OpenAI.";
        }

        return respuestaIA; // Si no hay una acción específica, devuelve la respuesta de OpenAI
    }





    private String consultarAPIOpenAI(String mensaje) {
        // Crear la solicitud a la API de OpenAI
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + API_KEY);
        headers.setContentType(MediaType.APPLICATION_JSON);

        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-4o-mini"); // Cambia el modelo si es necesario
        requestBody.put("store", true);

        JSONObject message = new JSONObject();
        message.put("role", "user");
        message.put("content", mensaje);

        requestBody.put("messages", new JSONArray().put(message));

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        // Realizar la solicitud POST a la API de OpenAI
        ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.POST, entity, String.class);

        // Procesar la respuesta de la API
        return response.getBody();
    }




}
