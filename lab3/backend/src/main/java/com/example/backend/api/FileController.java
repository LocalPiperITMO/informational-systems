package com.example.backend.api;

import java.io.InputStream;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.FileRequest;
import com.example.backend.dto.response.FileResponse;
import com.example.backend.model.ImportOperation;
import com.example.backend.repo.ImportOperationRepository;
import com.example.backend.service.FileProcessingService;
import com.example.backend.service.MinioService;
import com.example.backend.service.UserService;
import com.example.backend.utils.JwtUtil;


@RestController
@RequestMapping("/api/file")
@CrossOrigin(origins="http://localhost:5173")
public class FileController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private FileProcessingService fileProcessingService;

    @Autowired
    private ImportOperationRepository imopsRepository;

    @Autowired
    private MinioService minioService;

    private boolean checkAuth(String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            return !(userService.findByUsername(username) == null || !jwtUtil.validateToken(token, username));
        } catch (io.jsonwebtoken.security.SignatureException | io.jsonwebtoken.MalformedJwtException | io.jsonwebtoken.ExpiredJwtException e) {
            return false;
        }
    }

    // GUESS WHO'S BACK, BACK AGAIN
    @PostMapping("/executeScript")
    public ResponseEntity<FileResponse> executeScript(@ModelAttribute FileRequest request) {
        if (!checkAuth(request.getToken())) return ResponseEntity.status(403).body(new FileResponse(-1, null));
        return ResponseEntity.ok(fileProcessingService.processFiles(request.getFiles(), jwtUtil.extractUsername(request.getToken())));
    }

    @GetMapping("/downloadScript")
    public ResponseEntity<Resource> downloadScript(@RequestParam Long id, @RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        if (!checkAuth(jwtToken)) return ResponseEntity.status(403).body(null);

        ImportOperation imop;
        Optional<ImportOperation> maybeImop = imopsRepository.findById(id);
        if (maybeImop.isPresent()) {
            imop = maybeImop.get();
        } else return ResponseEntity.status(400).body(null);
        try {
            String username = imop.getUsername();
            InputStream is = minioService.downloadFile(username + "/" + imop.getUuid());
        
            InputStreamResource resource = new InputStreamResource(is);

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + imop.getFilename() + "\"")
            .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }
}