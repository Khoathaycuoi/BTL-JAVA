package com.nhakhoa.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Lấy chuỗi Token từ Header của Request
        final String authHeader = request.getHeader("Authorization");

        // Nếu không có Token hoặc không bắt đầu bằng "Bearer ", cho đi tiếp nhưng không cấp quyền
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Cắt bỏ chữ "Bearer " để lấy đúng chuỗi JWT
        final String jwt = authHeader.substring(7);

        try {
            final String username = jwtService.extractUsername(jwt);

            // 3. Nếu Token chuẩn và chưa được xác thực trong Context
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtService.isTokenValid(jwt, username)) {

                    // Lấy quyền từ Token (ví dụ: ROLE_ADMIN)
                    String role = jwtService.extractRole(jwt);

                    // Cấp thẻ thông hành đưa vào Security Context của Spring
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            username, null, Collections.singletonList(new SimpleGrantedAuthority(role))
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Token hết hạn hoặc bị sửa đổi -> Bỏ qua, gác cổng sẽ từ chối
            System.out.println("Lỗi xác thực Token: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}