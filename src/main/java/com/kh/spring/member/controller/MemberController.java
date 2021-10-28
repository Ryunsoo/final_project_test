package com.kh.spring.member.controller;

import java.util.UUID;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.util.CookieGenerator;

import com.kh.spring.common.code.ErrorCode;
import com.kh.spring.common.exception.HandlableException;
import com.kh.spring.common.validator.ValidateResult;
import com.kh.spring.member.model.dto.Member;
import com.kh.spring.member.model.service.MemberService;
import com.kh.spring.member.model.service.MemberServiceImpl;
import com.kh.spring.member.validator.JoinForm;
import com.kh.spring.member.validator.JoinFormValidator;

	//1. @Controller : 해당 클래스를 applicationContext에 bean으로 등록
	//				Controller와 관련된 annotation을 사용할 수 있게 해준다. (Controller에서만 사용할 수 있는 annotation)
	//2. @RequestMapping : 요청 URL과 Controller의 메서드 매서드 매핑을 지원
	//				클래스 위에 선언할 경우, 해당 클래스의 모든 메서드가 지정된 경로를 상위경로로 가진다.
	//3. @GetMapping : Get 방식의 요청 URL과 Controller의 메서드 매서드 매핑을 지원
	//4. @PostMapping : Post 방식의 요청 URL과 Controller의 메서드 매서드 매핑을 지원
	//5. @RequestParam : 요청 파라미터를 컨트롤러 메서드의 매개변수에 바인드 (form 태그)
	//				단, Content-type이 application/x-www-form-urlEncoded 인 경우에만 가능
	//				FormHttpMessageConverter가 동작
	//6. @ModelAttribute : 요청 파라미터를 setter를 사용해 메서드 매개변수에 선언된 객체에 바인드
	//				Model 객체의 attribute로 자동으로 저장
	//7. @RequestBody : 요청 body를 읽어서 자바의 객체에 바인드 (비동기통신 - ex_json)
	//				application/x-www-form-urlEncoded를 지원하지 않는다.
	//8. @RequestHeader : 요청 헤더를 메서드의 매개변수에 바인드
	//9. @SessionAttribute : 원하는 session의 속성값을 매개변수에 바인드
	//10. @CookieValue : 원하는 cookie값을 매개변수에 바인드
	//11. @PathVariable : url 템플릿에 담긴 파라미터값을 매개변수에 바인드
	//12. @ResponseBody : 메서드가 반환하는 값을 응답 body에 작성
	//13. @Servlet : 객체를 컨트롤러의 매개변수에 선언해 주입받을 수 있다.
	//				HttpServletRequest, HttpServletResponse, HttpSession

@Controller
@RequestMapping("member")
public class MemberController {

	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	private MemberService memberService;
	private JoinFormValidator joinFormValidator;
	
	public MemberController(MemberService memberService, JoinFormValidator joinFormValidator) {
		this.memberService = memberService;
		this.joinFormValidator = joinFormValidator;
	}
	
	//Model 속성명 자동 생성 규칙
	//com.myapp.Product becomes "product"
	//com.myapp.MyProduct becomes "myProduct"
	//com.myapp.UKProduct becomes "UKProduct"
	
	@InitBinder(value="joinForm") //model의 속성 중 속성명이 joinForm인 속성이 있는 경우 initBinder 메서드 실행
	public void initBinder(WebDataBinder webDataBinder) {
		webDataBinder.addValidators(joinFormValidator);
	}
	
	@GetMapping("join")
	public void joinForm(Model model) {
		model.addAttribute(new JoinForm()).addAttribute("error", new ValidateResult().getError());
	}
	
	@PostMapping("join")
	public String join(@Validated JoinForm form,	//@Validated 어노테이션을 지정하면 해당 타입을 찾아 매칭한다.
			Errors errors,	//Errors객체는 반드시 검증될 객체 바로 뒤에 작성
			Model model,
			HttpSession session,
			RedirectAttributes redirectAttr
			) {
		
		ValidateResult vr = new ValidateResult();
		//validator에서 발생한 오류가 없어도 model에 넣어주어야 추후 템플릿 교체 후 오류가 발생하지 않는다.
		model.addAttribute("error", vr.getError());
		
		if(errors.hasErrors()) {
			vr.addError(errors);
			return "member/join";
		}
		
		//token 생성
		String token = UUID.randomUUID().toString();
		session.setAttribute("persistUser", form);
		session.setAttribute("persistToken", token);
		
		memberService.authenticateByEmail(form, token);
		redirectAttr.addFlashAttribute("message", "이메일이 발송되었습니다.");
		
		return "redirect:/";
	}
	
	@GetMapping("join-impl/{token}")
	public String joinImpl(@PathVariable String token
							,@SessionAttribute(value = "persistToken", required = false) String persistToken
							,@SessionAttribute(value = "persistUser", required = false) JoinForm form
							,HttpSession session
							,RedirectAttributes redirectAttrs) {
		
		if(!token.equals(persistToken)) {
			throw new HandlableException(ErrorCode.AUTHENTICATION_FAILED_ERROR);
		}
		
		memberService.insertMember(form);
		redirectAttrs.addFlashAttribute("message", "회원가입을 환영합니다. 로그인 해주세요.");
		session.removeAttribute("persistToken");
		session.removeAttribute("persistUser");
		return "redirect:/member/login";
	}
	
	@PostMapping("join-json")
	public String joinWithJson(@RequestBody Member member) {
		logger.debug(member.toString());
		return "index";
	}
	
	//로그인 페이지 이동 메서드
	//메서드명 : login
	@GetMapping("login")
	public void login() {}
	
	//로그인 실행 메서드
	//메서드명 : loginlmpl
	//재지정할 jsp : mypage
	@PostMapping("login")
	public String loginImpl(Member member, HttpSession session, RedirectAttributes redirectAttr) {
		
		Member certifiedUser = memberService.authenticateUser(member);
		
		if(certifiedUser == null) {
			redirectAttr.addFlashAttribute("message", "아이디나 비밀번호가 정확하지 않습니다.");
			return "redirect:/member/login";
		}
		
		session.setAttribute("authentication", certifiedUser);
		logger.debug(certifiedUser.toString());
		return "redirect:/member/mypage"; //요청 재요청(response.sendRedirect())
	}
	
	@GetMapping("mypage")
	public String mypage(@CookieValue(name="JSESSIONID", required=false) String sessionId,
						@SessionAttribute(name="authentication", required=false) Member member,
						HttpServletResponse response) {
		
		//Cookie 생성 및 응답헤더에 추가
		CookieGenerator cookieGenerator = new CookieGenerator();
		cookieGenerator.setCookieName("testCookie");
		cookieGenerator.addCookie(response, "test_cookie");	//cookie 내용에 띄어쓰기가 있으면 url safe하지 않아 오류발생
		
		logger.debug("@CookieValue : " + sessionId);
		logger.debug("@@SessionAttribute : " + member);
		
		//HttpServletResponse 객체를 주입받아 사용하는 메서드에서는 반환값없이 void로 진행하면 자동 view 지정이 불가능하다.
		return "member/mypage";
	}
	
	@GetMapping("id-check")
	@ResponseBody	//@ResponseBody가 없을 때 반환값은 포워드 경로
	//@ResponseBody일 때 자바 빈 규약을 지킨 객체(ex_Member)를 반환할 시에, 자동으로 Json 객체로 변환해서 응답해준다.
	public String idCheck(String userId) {
		Member member = memberService.selectMemberByUserId(userId);
		
		if(member == null) {
			return "available";
		}else {
			return "disable";
		}
	}
	
	
}
