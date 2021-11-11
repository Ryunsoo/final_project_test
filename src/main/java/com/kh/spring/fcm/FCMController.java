package com.kh.spring.fcm;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class FCMController {

	private final FirebaseInit init;
	
	@GetMapping("v1")
	public String v1() {
		//init.init();
		return "test";
	}
	
	@GetMapping("v2")
	public String v2(String token,
					HttpSession session) {
		System.out.println(token);
		
		session.setAttribute("token", token);
		/*
		 * MultiValueMap<String, String> body = new LinkedMultiValueMap<String,
		 * String>();
		 * body.add("notification", Map.of("body", "테스트입니다.", "title",
		 * "test").toString());
		 * body.add("target", "ko");
		 */
		 
		
		
		return "test";
	}
}
