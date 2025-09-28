package com.smartmedical.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.smartmedical.model.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
}
