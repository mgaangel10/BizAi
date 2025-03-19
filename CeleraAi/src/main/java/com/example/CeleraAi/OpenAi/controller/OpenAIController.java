package com.example.CeleraAi.OpenAi.controller;

import com.example.CeleraAi.OpenAi.models.Recomendaciones;
import com.example.CeleraAi.OpenAi.models.RecomendacionesRequest;
import com.example.CeleraAi.OpenAi.service.OpenAIService;
import com.example.CeleraAi.OpenAi.service.RecomendacionesService;
import com.example.CeleraAi.Producto.model.Producto;
import com.example.CeleraAi.Venta.model.Venta;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class OpenAIController {

    private final OpenAIService openAIService;
    private final RecomendacionesService recomendacionesService;

    @PostMapping("usuario/generarTexto")
    public String generarTexto(@RequestBody String mensajeUsuario) {
        return openAIService.generarTextoConIA(mensajeUsuario);
    }

    @PostMapping("/usuario/generarRecomendaciones/{id}")
    public ResponseEntity<String> generarRecomendaciones(@RequestBody String preguntaUSuario, @PathVariable UUID id) {
        String resultado = openAIService.generarRecomendaciones(preguntaUSuario,id);
        return ResponseEntity.ok(resultado);
    }

}
