package com.kh.spring.common.mail;

import java.util.Date;

import javax.mail.Message;
import javax.mail.internet.MimeMessage;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import com.kh.spring.common.code.Config;
import com.kh.spring.common.code.ErrorCode;
import com.kh.spring.common.exception.HandlableException;

@Component
public class MailSender {

	JavaMailSender mailSender;
	
	public MailSender(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}
	
	public void send(String to, String subject, String htmlTxt) {
		MimeMessage msg =  mailSender.createMimeMessage();
		
		try {
			msg.setFrom(Config.COMPANY_EMAIL.DESC);
	        msg.setRecipients(Message.RecipientType.TO, to); //받는사람
	        msg.setSubject(subject);
	        msg.setSentDate(new Date());
	        msg.setText(htmlTxt, "utf-8", "html");
	        mailSender.send(msg);
		} catch (Exception e) {
			throw new HandlableException(ErrorCode.MAIL_SEND_FAIL);
		}
		
		
	}
}
