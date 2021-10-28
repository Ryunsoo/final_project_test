package com.kh.spring.board.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.multipart.MultipartFile;

import com.kh.spring.board.model.dto.Board;
import com.kh.spring.board.model.service.BoardService;
import com.kh.spring.member.model.dto.Member;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("board")
public class BoardController {

	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	private final BoardService boardservice;
	
	@GetMapping("board-form")
	public void boardForm() {}
	
	@PostMapping("upload")
	public String uploadBoard(
			Board board,
			@RequestParam List<MultipartFile> files, //게시글 작성 시 파일 첨부를 하지 않아도 MultipartFile 객체가 넘어오게 된다.
			@SessionAttribute("authentication") Member member
			) {
		
		logger.debug("files : " + files.size());
		logger.debug("files.0 : " + files.get(0));
		logger.debug("mf.isEmpty : " + files.get(0).isEmpty());
		
		board.setUserId(member.getUserId());
		boardservice.insertBoard(files, board);
		
		return "redirect:/";
	}
	
	@GetMapping("board-detail")
	public void boardDetail(Model model, String bdIdx) {
		Map<String, Object> commandMap = boardservice.selectBoardByIdx(bdIdx);
		model.addAllAttributes(commandMap);
	}
	
	
	
}
