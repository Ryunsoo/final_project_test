package com.kh.spring.chatting;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.kh.spring.member.model.dto.Member;

@Controller
@RequestMapping("chat")
public class CharController {

	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@GetMapping("chat-form")
	public void chatForm() {}
	
	@GetMapping("chat")
	public void chat(Model model) {
		
		Member user = (Member) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		//Member user = model.getAttribute(null);
		logger.debug("GET Chat / Username : " + user.getUserId());
		
		model.addAttribute("userid", user.getUserId());
	}
}
