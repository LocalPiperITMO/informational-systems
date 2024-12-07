package com.example.backend.dto.request;

import java.util.List;

import com.example.backend.utils.Verdict;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoleApprovalRequest {
    @NotNull
    @NotBlank
    private String token;

    @NotNull
    private List<Verdict> verdicts;

}
