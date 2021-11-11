package com.kh.spring.chatting;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class ChattingHandler extends TextWebSocketHandler{

	private List<WebSocketSession> sessionList = new ArrayList<WebSocketSession>();
	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		logger.debug("afterConnectionEstablished");
		sessionList.add(session);
		
		logger.info(session.getPrincipal().getName());
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		logger.debug("handelTestMessage");
		logger.debug(session.getId() + " : " + message);
		
		for (WebSocketSession sessions : sessionList) {
			sessions.sendMessage(new TextMessage(session.getPrincipal().getName() + ":" + message.getPayload()));
		}
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		logger.debug("afterConnectionClosed");
		sessionList.remove(session);
		
		logger.debug(session.getPrincipal().getName() + "닒이 퇴장하셨습니다.");
	}
	
}
