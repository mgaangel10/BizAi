package com.example.CeleraAi.users.service;


import com.example.CeleraAi.users.Dto.GetUsuario;
import com.example.CeleraAi.users.Dto.PostCrearUserDto;
import com.example.CeleraAi.users.Dto.PostLogin;
import com.example.CeleraAi.users.model.UserRoles;
import com.example.CeleraAi.users.model.Usuario;
import com.example.CeleraAi.users.repositorio.AdministradorRepo;
import com.example.CeleraAi.users.repositorio.UsuarioRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepo usuarioRepo;
    private final PasswordEncoder passwordEncoder;
    private final AdministradorRepo administradorRepo;


    public Optional<Usuario> findById(UUID id){return usuarioRepo.findById(id);}

    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepo.findFirstByEmail(email);
    }

    public  Usuario crearUsuario(PostCrearUserDto postCrearUserDto, EnumSet<UserRoles> userRoles){
        if (usuarioRepo.existsByEmailIgnoreCase(postCrearUserDto.email())||administradorRepo.existsByEmailIgnoreCase(postCrearUserDto.email())){
            throw new RuntimeException("El email ya ha sido registrado");
        }

        Usuario usuario = Usuario.builder()
                .email(postCrearUserDto.email())
                .name(postCrearUserDto.name())
                .lastName(postCrearUserDto.lastName())
                .password(passwordEncoder.encode(postCrearUserDto.password()))
                .createdAt(LocalDateTime.now())
                .username(postCrearUserDto.name()+postCrearUserDto.lastName())
                .phoneNumber(postCrearUserDto.phoneNumber())
                .birthDate(postCrearUserDto.nacimiento())
                .roles(EnumSet.of(UserRoles.USER))
                .enabled(false)
                .build();

        return usuarioRepo.save(usuario);

    }

    public Usuario createWithRole(PostCrearUserDto postCrearUserDto){
        return crearUsuario(postCrearUserDto,EnumSet.of(UserRoles.USER));
    }
    public GetUsuario getUsuario(UUID uuid){
        GetUsuario usuario = usuarioRepo.getUsuario(uuid);
        return usuario;

    }
    public Usuario setearEnabled(PostLogin postCrearUserDto){
        Optional<Usuario> usuario = usuarioRepo.findByEmailIgnoreCase(postCrearUserDto.email());

        if (usuario.isPresent() || usuario.get().isEnabled()){
            usuario.get().setEnabled(true);
            return usuarioRepo.save(usuario.get());
        }else {
            throw new RuntimeException("No se encuentra el usuario");
        }
    }


}
