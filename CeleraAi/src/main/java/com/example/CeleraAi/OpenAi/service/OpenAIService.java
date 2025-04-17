package com.example.CeleraAi.OpenAi.service;

import com.example.CeleraAi.Negocio.model.Negocio;
import com.example.CeleraAi.Negocio.repositorio.NegocioRepo;
import com.example.CeleraAi.OpenAi.PreguntaUsuarioDto;
import com.example.CeleraAi.OpenAi.RegistroAccionIARepo;
import com.example.CeleraAi.OpenAi.models.AccionIA;
import com.example.CeleraAi.OpenAi.models.MensajeIA;
import com.example.CeleraAi.OpenAi.models.ProductoStockUpdate;
import com.example.CeleraAi.OpenAi.models.RegistroAccionIA;
import com.example.CeleraAi.Producto.model.Producto;
import com.example.CeleraAi.Producto.repositorio.ProductoRepo;
import com.example.CeleraAi.Venta.model.DetalleVenta;
import com.example.CeleraAi.Venta.model.Venta;
import com.example.CeleraAi.Venta.repositorio.VentaRepo;
import com.example.CeleraAi.Venta.service.VentaService;
import com.example.CeleraAi.users.model.Usuario;
import com.example.CeleraAi.users.repositorio.UsuarioRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OpenAIService {

    private static final String API_URL = "https://api.openai.com/v1/chat/completions";
    private static final String API_KEY = "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"; // ¡Recuerda nunca compartir tu API key!
    private final UsuarioRepo usuarioRepo;
    private final VentaService ventaService;
    private final VentaRepo ventaRepo;
    private final NegocioRepo negocioRepo;
    private final ProductoRepo productoRepo;
    private final RegistroAccionIARepo registroAccionIARepo;

    private final Map<UUID, List<MensajeIA>> historialPorUsuario = new HashMap<>();
    private final Map<UUID, AccionIA> ultimaSugerenciaPendiente = new HashMap<>();
    private List<ProductoStockUpdate> productos; // si no lo tienes, lo creamos

    public String generarRecomendacionConIA(PreguntaUsuarioDto pregunta, UUID idNegocio) {
        Optional<Usuario> usuario = obtenerUsuarioAutenticado();
        Optional<Negocio> negocio = negocioRepo.findById(idNegocio);

        if (usuario.isEmpty() || negocio.isEmpty()) return "❌ Usuario o negocio no encontrados.";

        String promptSistema = "Eres un asistente inteligente para negocios pequeños. Analiza los datos y responde de forma útil y profesional.";
        UUID userId = usuario.get().getId();

        List<MensajeIA> historial = historialPorUsuario.computeIfAbsent(userId, k -> new ArrayList<>());
        String mensajeUsuario = pregunta.pregunta().toLowerCase().trim();

        // ✅ SI el usuario responde afirmativamente (tipo "sí")
        if (mensajeUsuario.equals("sí") || mensajeUsuario.equals("si") || mensajeUsuario.contains("adelante")) {
            AccionIA sugerencia = ultimaSugerenciaPendiente.get(userId);
            if (sugerencia != null) {
                ultimaSugerenciaPendiente.remove(userId); // Limpiamos después de ejecutar
                return confirmarYEjecutarAccion(sugerencia, idNegocio);
            } else {
                return "⚠️ No hay ninguna sugerencia pendiente para confirmar.";
            }
        }

        // ✅ SI el usuario responde "no"
        if (mensajeUsuario.equals("no") || mensajeUsuario.contains("mejor no")) {
            ultimaSugerenciaPendiente.remove(userId);
            return "👍 Vale, no he añadido nada. Si quieres otra sugerencia, dímelo.";
        }

        // ✅ Primera vez en la conversación: damos todo el contexto
        if (historial.isEmpty()) {
            String contexto = construirPromptUniversal(negocio.get(), pregunta.pregunta());
            historial.add(new MensajeIA("user", contexto));
        } else {
            historial.add(new MensajeIA("user", pregunta.pregunta()));
        }

        // Llamamos a OpenAI con el historial completo
        String respuesta = consultarOpenAIConHistorial(promptSistema, historial);

        // Guardamos la respuesta en historial
        String contenido = new JSONObject(respuesta)
                .getJSONArray("choices")
                .getJSONObject(0)
                .getJSONObject("message")
                .getString("content");

        historial.add(new MensajeIA("assistant", contenido));

        return procesarRespuestaSinEjecutar(respuesta); // le pasamos el id para guardar sugerencia
    }


    private Optional<Usuario> obtenerUsuarioAutenticado() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return usuarioRepo.findByEmailIgnoreCase(userDetails.getUsername());
        }
        return Optional.empty();
    }

    private String consultarOpenAIConHistorial(String promptSistema, List<MensajeIA> historial) {
        RestTemplate client = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + API_KEY);

        JSONArray messages = new JSONArray();
        messages.put(new JSONObject().put("role", "system").put("content", promptSistema));
        for (MensajeIA m : historial) {
            messages.put(new JSONObject().put("role", m.getRole()).put("content", m.getContent()));
        }

        JSONObject request = new JSONObject();
        request.put("model", "gpt-4o-mini");
        request.put("messages", messages);
        request.put("stream", false);

        HttpEntity<String> entity = new HttpEntity<>(request.toString(), headers);
        ResponseEntity<String> response = client.exchange(API_URL, HttpMethod.POST, entity, String.class);

        return response.getBody();
    }

    private String construirPromptUniversal(Negocio negocio, String pregunta) {
        String categoria = negocio.getCategorias().getNombre();

        StringBuilder productosStr = new StringBuilder();
        for (Producto p : negocio.getProdcutos()) {
            productosStr.append("- %s, %.2f€, stock: %d, proveedor: %.2f€\n"
                    .formatted(p.getNombre(), p.getPrecio(), p.getStock(), p.getPrecioProveedor()));
        }

        StringBuilder ventasStr = new StringBuilder();
        for (Venta v : negocio.getVentas()) {
            for (DetalleVenta d : v.getDetalleVentas()) {
                ventasStr.append("- %s: %d uds x %.2f€ (%s)\n"
                        .formatted(d.getProdcuto().getNombre(), d.getCantidad(), d.getProdcuto().getPrecio(), v.getFecha()));
            }
        }

        StringBuilder facturasStr = new StringBuilder();
        negocio.getFacturas().forEach(f -> {
            facturasStr.append("- Nº %s | Cliente: %s | Total: %.2f€ | Impuestos: %.2f€ | Subtotal: %.2f€\n"
                    .formatted(f.getNumeroFactura(), f.getCliente(), f.getTotal(), f.getImpuestos(), f.getSubtotal()));
        });

        StringBuilder ventasSinFacturaStr = new StringBuilder();
        negocio.getVentas().stream()
                .filter(v -> v.getFactura() == null)
                .forEach(v -> {
                    ventasSinFacturaStr.append("- Venta del %s:\n".formatted(v.getFecha()));
                    v.getDetalleVentas().forEach(d -> {
                        ventasSinFacturaStr.append("   • %s: %d uds a %.2f€\n"
                                .formatted(d.getProdcuto().getNombre(), d.getCantidad(), d.getProdcuto().getPrecio()));
                    });
                });

        return """
Eres un asistente inteligente especializado en la gestión de negocios pequeños.

📌 La categoría de este negocio es: **%s**
Utiliza esta información para adaptar tus respuestas, recomendaciones y acciones al tipo de negocio. 
No sugieras productos o decisiones que no tengan relación con esta categoría.

Tu trabajo es analizar la información del negocio y ayudar al usuario con:

✅ Consultas sobre sus datos (ventas, productos, stock, facturas…)
✅ Acciones directas (crear productos, aplicar promociones, etc.)
✅ Sugerencias inteligentes (nuevos productos, ideas para vender más…)

---

📌 SIEMPRE RESPONDE EN DOS PARTES:

1️⃣ Un mensaje corto, profesional y claro (máximo 3 líneas).
2️⃣ Justo debajo, un JSON con la acción o respuesta estructurada.

---

📋 FORMATO DEL JSON:
{
  "tipo": "consulta" | "accion" | "sugerencia",
  "accion": "ver_ventas" | "crear_producto" | "sugerir_producto_nuevo" | "alertar_stock_bajo" | "crear_promocion" | etc,
  "datos": {
    ...
  }
}

---

🔍 SI EL USUARIO HACE UNA PREGUNTA:
Responde con tipo = "consulta"

🔧 SI EL USUARIO DA UNA ORDEN:
Responde con tipo = "accion" y ejecuta sin preguntar

💡 SI ES UNA IDEA O ANÁLISIS:
Responde con tipo = "sugerencia" y espera confirmación

---

⚠️ MUY IMPORTANTE:
- NO INVENTES DATOS. Usa solo la información proporcionada.
- Si no tienes suficiente información, dilo educadamente.
- El JSON debe estar bien cerrado y sin etiquetas ```json.

---

📦 DATOS DEL NEGOCIO:

PRODUCTOS:
%s

VENTAS:
%s

FACTURAS:
%s

VENTAS SIN FACTURA:
%s

---

❓PREGUNTA DEL USUARIO:
%s
""".formatted(
                categoria,
                productosStr,
                ventasStr,
                facturasStr,
                ventasSinFacturaStr,
                pregunta
        );
    }

    private String procesarRespuestaSinEjecutar(String respuestaIA) {
        Optional<Usuario> usuario = obtenerUsuarioAutenticado();
        try {
            String content = new JSONObject(respuestaIA)
                    .getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content");

            int indexJson = content.indexOf("{");
            if (indexJson == -1) return "⚠ La IA no devolvió un JSON válido.\n" + content;

            String texto = content.substring(0, indexJson).trim();
            String jsonSolo = content.substring(indexJson).trim();
            JSONObject json = new JSONObject(jsonSolo);
            String tipo = json.optString("tipo");

            if ("sugerencia".equalsIgnoreCase(tipo)) {
                AccionIA sugerencia = new ObjectMapper().readValue(jsonSolo, AccionIA.class);
                ultimaSugerenciaPendiente.put(usuario.get().getId(), sugerencia);
            }


            JSONObject resultado = new JSONObject();
            resultado.put("mensaje", texto);
            resultado.put("accion", new JSONObject(jsonSolo));

            return resultado.toString();
        } catch (Exception e) {
            return "⚠ Error procesando la respuesta IA: " + e.getMessage();
        }
    }

    public String confirmarYEjecutarAccion(AccionIA accion, UUID idNegocio) {
        Optional<Negocio> negocioOpt = negocioRepo.findById(idNegocio);
        if (negocioOpt.isEmpty()) return "❌ Negocio no encontrado.";

        Negocio negocio = negocioOpt.get();

        switch (accion.getAccion()) {

            case "crear_producto", "sugerir_producto_nuevo" -> {
                Producto prodcuto = new Producto();
                prodcuto.setNombre(accion.getNombre());
                prodcuto.setPrecio(accion.getPrecio() == null ? 1.0 : accion.getPrecio());
                prodcuto.setStock(Optional.ofNullable(accion.getStock()).orElse(10));
                prodcuto.setDisponible(true);
                prodcuto.setPrecioProveedor(Optional.ofNullable(accion.getPrecioProveedor()).orElse(1.0));
                prodcuto.setNegocio(negocio);

                productoRepo.save(prodcuto);
                negocio.getProdcutos().add(prodcuto);
                negocioRepo.save(negocio);
                guardarRegistro(accion.getAccion(), "Producto creado: " + prodcuto.getNombre(), negocio.getUsuario());
                return "✅ Producto añadido con éxito.";
            }
            case "actualizar_stock" -> {
                System.out.println("👉 Ejecutando actualización de stock...");

                StringBuilder resultado = new StringBuilder();

                // Intentamos sacar desde una lista
                if (accion.getProductos() != null && !accion.getProductos().isEmpty()) {
                    for (ProductoStockUpdate update : accion.getProductos()) {
                        actualizarProducto(update, negocio, resultado);
                    }
                } else {
                    // Intentamos sacar desde campos planos
                    Map<String, Object> datos = accion.getDatos();
                    String nombre = (String) datos.get("producto");
                    Integer stock = datos.get("nuevo_stock") != null ? ((Number) datos.get("nuevo_stock")).intValue() : null;

                    if (nombre != null && stock != null) {
                        ProductoStockUpdate update = new ProductoStockUpdate(nombre, stock);
                        actualizarProducto(update, negocio, resultado);
                    } else {
                        resultado.append("❌ Datos incompletos para actualizar stock.");
                    }
                }

                guardarRegistro("actualizar_stock", resultado.toString(), negocio.getUsuario());
                return resultado.toString();
            }


            default -> {
                return "⚠ Acción no reconocida: " + accion.getAccion();
            }
        }
    }
    private void actualizarProducto(ProductoStockUpdate update, Negocio negocio, StringBuilder resultado) {
        Optional<Producto> prodOpt = productoRepo.findByNombreIgnoreCaseAndNegocio(update.getNombre(), negocio);
        if (prodOpt.isPresent()) {
            Producto p = prodOpt.get();
            p.setStock(update.getNuevo_stock());
            productoRepo.save(p);
            resultado.append("✅ ").append(p.getNombre())
                    .append(": stock actualizado a ").append(update.getNuevo_stock()).append("\\n");
        } else {
            resultado.append("❌ No se encontró el producto: ").append(update.getNombre()).append("\\n");
        }
    }

    private void guardarRegistro(String accion, String resultado, Usuario usuario) {
        RegistroAccionIA registro = new RegistroAccionIA();
        registro.setAccion(accion);
        registro.setResultado(resultado);
        registro.setFecha(LocalDateTime.now());
        registro.setUsuario(usuario);
        registroAccionIARepo.save(registro);
    }


    //alertas ia
    public List<String> generarAlertas(UUID idNegocio) {
        Optional<Negocio> negocioOpt = negocioRepo.findById(idNegocio);
        if (negocioOpt.isEmpty()) return List.of("❌ Negocio no encontrado.");

        Negocio negocio = negocioOpt.get();
        List<String> alertas = new ArrayList<>();

        // 1️⃣ Alerta por stock bajo
        for (Producto p : negocio.getProdcutos()) {
            if (p.getStock() <= 5) {
                alertas.add("⚠️ El producto '" + p.getNombre() + "' tiene un stock bajo: " + p.getStock() + " unidades.");
            }
        }

        // 2️⃣ Caída de ventas esta semana vs anterior
        List<Venta> ventas = negocio.getVentas();
        LocalDate hoy = LocalDate.now();
        LocalDate inicioSemana = hoy.minusDays(hoy.getDayOfWeek().getValue() - 1);
        LocalDate inicioSemanaAnterior = inicioSemana.minusWeeks(1);

        double totalSemana = ventas.stream()
                .filter(v -> v.getFecha().isAfter(inicioSemana.minusDays(1)))
                .mapToDouble(Venta::getTotalVenta)
                .sum();

        double totalSemanaAnterior = ventas.stream()
                .filter(v -> !v.getFecha().isBefore(inicioSemanaAnterior) && v.getFecha().isBefore(inicioSemana))
                .mapToDouble(Venta::getTotalVenta)
                .sum();

        if (totalSemanaAnterior > 0) {
            double caida = ((totalSemanaAnterior - totalSemana) / totalSemanaAnterior) * 100;
            if (caida >= 25) {
                alertas.add("📉 Tus ventas han caído un " + String.format("%.1f", caida) + "% respecto a la semana pasada.");
            }
        }

        // 3️⃣ Productos sin ventas en 30 días
        LocalDate hace30Dias = hoy.minusDays(30);

        for (Producto p : negocio.getProdcutos()) {
            boolean seVendio = ventas.stream()
                    .flatMap(v -> v.getDetalleVentas().stream())
                    .anyMatch(d -> d.getProdcuto().getId().equals(p.getId()) &&
                            d.getVenta().getFecha().isAfter(hace30Dias));

            if (!seVendio) {
                alertas.add("😴 El producto '" + p.getNombre() + "' no ha tenido ventas en los últimos 30 días.");
            }
        }

        // 4️⃣ Previsión de ventas para la próxima semana (promedio simple de las últimas 4 semanas)
        LocalDate hace4Semanas = hoy.minusWeeks(4);
        double totalUltimas4Semanas = ventas.stream()
                .filter(v -> v.getFecha().isAfter(hace4Semanas.minusDays(1)))
                .mapToDouble(Venta::getTotalVenta)
                .sum();

        double promedioSemanal = totalUltimas4Semanas / 4.0;
        alertas.add("🔮 Previsión de ventas para la próxima semana: " + String.format("%.2f", promedioSemanal) + " €.");

        return alertas;
    }

    private LocalDate toLocalDate(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    private Date toDate(LocalDate localDate) {
        return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

// resumen del dia
public String generarResumenTexto(UUID idNegocio) {
    // Usamos las nuevas consultas separadas para evitar errores con múltiples bags
    Optional<Negocio> negocioVentasOpt = negocioRepo.cargarConVentas(idNegocio);
    Optional<Negocio> negocioProductosOpt = negocioRepo.cargarConProductos(idNegocio);

    if (negocioVentasOpt.isEmpty() || negocioProductosOpt.isEmpty()) {
        return "❌ No se encontró el negocio o no se pudieron cargar los datos correctamente.";
    }

    Negocio negocioVentas = negocioVentasOpt.get();
    Negocio negocioProductos = negocioProductosOpt.get();

    List<Venta> ventasHoy = ventaRepo.findVentasConDetallesByNegocio(idNegocio)
            .stream()
            .filter(v -> v.getFecha().isEqual(LocalDate.now()))
            .toList();


    if (ventasHoy.isEmpty()){
        System.out.println("no hay ventas");
        return "📭 Hoy no se han registrado ventas."  ;
    }

    double totalVentas = ventasHoy.stream().mapToDouble(Venta::getTotalVenta).sum();

    // Agrupar productos vendidos
    Map<String, Integer> productosVendidos = new HashMap<>();
    for (Venta venta : ventasHoy) {
        for (DetalleVenta d : venta.getDetalleVentas()) {
            String nombre = d.getProdcuto().getNombre();
            productosVendidos.put(nombre,
                    productosVendidos.getOrDefault(nombre, 0) + d.getCantidad());
        }
    }

    // Ordenar por más vendidos
    List<Map.Entry<String, Integer>> topProductos = productosVendidos.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(3)
            .collect(Collectors.toList());

    // Gastos estimados (precio proveedor * cantidad vendida)
    double gastos = ventasHoy.stream()
            .flatMap(v -> v.getDetalleVentas().stream())
            .mapToDouble(d -> {
                Producto p = d.getProdcuto();
                return p.getPrecioProveedor() * d.getCantidad();
            }).sum();

    double beneficio = totalVentas - gastos;

    // Crear resumen en texto
    StringBuilder resumen = new StringBuilder();
    resumen.append("\uD83D\uDCCA Resumen del día - ").append(LocalDate.now()).append("\n\n");
    resumen.append("\uD83D\uDED9 Ventas totales: ").append(String.format("%.2f€", totalVentas)).append("\n");

    if (!topProductos.isEmpty()) {
        resumen.append("\uD83C\uDFC6 Productos más vendidos:\n");
        topProductos.forEach(entry ->
                resumen.append("   - ").append(entry.getKey()).append(" (x").append(entry.getValue()).append(")\n")
        );
    }

    resumen.append("\n\uD83D\uDCB8 Gastos estimados: ").append(String.format("%.2f€", gastos)).append("\n");
    resumen.append("\uD83D\uDCB0 Beneficio estimado: ").append(String.format("%.2f€", beneficio)).append("\n\n");
    resumen.append("¡Buen trabajo hoy! \uD83D\uDCAA");

    return resumen.toString();
}

}
