package com.capitalhub.auth.service;

import com.capitalhub.auth.dto.ForgotPasswordRequest;
import com.capitalhub.auth.dto.MessageResponse;
import com.capitalhub.auth.dto.ResetPasswordRequest;
import com.capitalhub.auth.entity.User;
import com.capitalhub.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Token válido por 1 hora
    private static final int TOKEN_EXPIRY_HOURS = 1;

    /**
     * Genera un token de reset y "simula" el envío del email por consola.
     */
    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        // Buscar usuario por email
        var userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            // Por seguridad, no revelamos si el email existe o no
            System.out.println("⚠️ [FORGOT-PASSWORD] Intento con email no registrado: " + request.getEmail());
            return MessageResponse.success(
                "Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña."
            );
        }

        User user = userOpt.get();

        // Generar token único
        String resetToken = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusHours(TOKEN_EXPIRY_HOURS);

        // Guardar token en usuario
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(expiry);
        userRepository.save(user);

        // ========================================
        // 📧 SIMULACIÓN DE ENVÍO DE EMAIL
        // En producción, aquí iría: emailService.sendResetEmail(user.getEmail(), resetToken);
        // ========================================
        System.out.println("═══════════════════════════════════════════════════════════════");
        System.out.println("📧 [EMAIL SIMULADO] Recuperación de contraseña");
        System.out.println("───────────────────────────────────────────────────────────────");
        System.out.println("   Para: " + user.getEmail());
        System.out.println("   Token: " + resetToken);
        System.out.println("   Expira: " + expiry);
        System.out.println("   ");
        System.out.println("   🔗 Link de reset (frontend):");
        System.out.println("   http://localhost:5173/reset-password?token=" + resetToken);
        System.out.println("═══════════════════════════════════════════════════════════════");

        return MessageResponse.success(
            "Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña."
        );
    }

    /**
     * Valida el token y actualiza la contraseña del usuario.
     */
    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        // Validar que el token no esté vacío
        if (request.getToken() == null || request.getToken().isBlank()) {
            return MessageResponse.error("Token inválido o expirado.");
        }

        // Validar contraseña
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            return MessageResponse.error("La contraseña debe tener al menos 6 caracteres.");
        }

        // Buscar usuario por token
        var userOpt = userRepository.findByResetToken(request.getToken());

        if (userOpt.isEmpty()) {
            System.out.println("⚠️ [RESET-PASSWORD] Token no encontrado: " + request.getToken());
            return MessageResponse.error("Token inválido o expirado.");
        }

        User user = userOpt.get();

        // Verificar que el token no haya expirado
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            System.out.println("⚠️ [RESET-PASSWORD] Token expirado para: " + user.getEmail());
            // Limpiar token expirado
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            return MessageResponse.error("El enlace ha expirado. Solicita uno nuevo.");
        }

        // ✅ Actualizar contraseña
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null); // Invalidar token usado
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        System.out.println("✅ [RESET-PASSWORD] Contraseña actualizada exitosamente para: " + user.getEmail());

        return MessageResponse.success("Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión.");
    }

    /**
     * Valida si un token es válido (usado por frontend para mostrar el formulario o error).
     */
    public MessageResponse validateToken(String token) {
        if (token == null || token.isBlank()) {
            return MessageResponse.error("Token inválido.");
        }

        var userOpt = userRepository.findByResetToken(token);

        if (userOpt.isEmpty()) {
            return MessageResponse.error("Token inválido o ya utilizado.");
        }

        User user = userOpt.get();

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return MessageResponse.error("El enlace ha expirado.");
        }

        return MessageResponse.success("Token válido.");
    }
}

