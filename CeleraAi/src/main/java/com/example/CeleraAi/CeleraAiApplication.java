package com.example.CeleraAi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CeleraAiApplication {

	public static void main(String[] args) {
		SpringApplication.run(CeleraAiApplication.class, args);
	}

}
