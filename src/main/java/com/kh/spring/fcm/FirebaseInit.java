package com.kh.spring.fcm;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

@Service
public class FirebaseInit {

	private static final String path = "medibook-69140-firebase-adminsdk-wils8-ea31942b5d.json";
	
	@PostConstruct
	public void init() {
		
		try {
			//직접 서비스 키 json 파일을 스트림으로 해서 설정할 수도 있다.
			FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(new ClassPathResource(path).getInputStream())).build();
			
			/*
			 * FirebaseOptions options = FirebaseOptions.builder()
			 * .setCredentials(GoogleCredentials.getApplicationDefault())
			 * //.setDatabaseUrl("https://<DATABASE_NAME>.firebaseio.com/")
			 * .build();
			 */
			
			if(FirebaseApp.getApps().isEmpty()) {
				FirebaseApp.initializeApp(options);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		
	}
	
	
}
