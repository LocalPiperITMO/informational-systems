package com.example.backend.service;

import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.minio.CopyObjectArgs;
import io.minio.CopySource;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;

@Service
public class MinioService {
        @Autowired
    private MinioClient minioClient;

    @Value("${minio.bucketName}")
    private String bucketName;

    public String uploadFile(String objectName, InputStream inputStream, String contentType) throws Exception {
        minioClient.putObject(
            PutObjectArgs.builder()
                .bucket(bucketName)
                .object(objectName)
                .stream(inputStream, inputStream.available(), -1)
                .contentType(contentType)
                .build()
        );
        return objectName;
    }

    public InputStream downloadFile(String objectName) throws Exception {
        return minioClient.getObject(
            GetObjectArgs.builder()
                .bucket(bucketName)
                .object(objectName)
                .build()
        );
    }

    public void deleteFile(String objectName) throws Exception {
        minioClient.removeObject(
            RemoveObjectArgs.builder()
                .bucket(bucketName)
                .object(objectName)
                .build()
        );
    }

    public void moveFile(String sourceObjectName, String destinationObjectName) throws Exception {
        minioClient.copyObject(
            CopyObjectArgs.builder()
                .bucket(bucketName)
                .object(destinationObjectName)
                .source(CopySource.builder()
                    .bucket(bucketName)
                    .object(sourceObjectName)
                    .build())
                .build()
        );

        deleteFile(sourceObjectName);
    }
}
