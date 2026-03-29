package com.nhakhoa.backend.config;

import com.nhakhoa.backend.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 1. Gọi máy soi thẻ vào đây
    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        // 2. MỞ CỬA: Đăng nhập và đăng ký Khách hàng không cần Token
                        .requestMatchers("/api/auth/login", "/api/auth/register/khach-hang").permitAll()

                        .requestMatchers("/api/users/bac-si", "/api/users/nhan-vien").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/api/users/khach-hang").hasAnyAuthority("ROLE_ADMIN", "ROLE_NHANVIEN")

                        .requestMatchers("/api/users/me").authenticated()

                        // 3. BẮT BUỘC: Tất cả các API còn lại (bao gồm tạo Bác sĩ) phải có Token hợp lệ
                        .anyRequest().authenticated()
                )

                // 4. Báo cho Spring biết ta dùng JWT, không lưu session kiểu cũ
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 5. LẮP MÁY SOI THẺ: Yêu cầu mọi Request phải chạy qua Filter này trước
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Thay vì fix cứng, bạn cũng có thể dùng @Value ở đây cho đồng bộ với WebConfig
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}