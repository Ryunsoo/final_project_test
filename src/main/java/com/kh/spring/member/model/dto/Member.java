package com.kh.spring.member.model.dto;

import java.nio.file.attribute.UserPrincipal;
import java.sql.Date;

import lombok.Data;

@Data
public class Member{

	private String userId;
	private String password;
	private String email;
	private String grade;
	private String tell;
	private Date rentableDate;
	private Date regDate;
	private int isLeave;

}
