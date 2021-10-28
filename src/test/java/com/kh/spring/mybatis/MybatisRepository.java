package com.kh.spring.mybatis;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.kh.spring.member.model.dto.Member;

@Mapper
public interface MybatisRepository {

	@Select("select password from member where user_id = #{userId}")
	String selectPasswordByUserId(@Param("userId") String userId);
	
	@Select("select * from member where user_id = #{userId}")
	Member selectMemberByUserId(String userId);
	
	@Select("select * from member inner join rent_master using(user_id) where user_id = #{userId}")
	List<Map<String, Object>> selectRentAndMemberByUserId(String userId);
	
	//쿼리를 Mapper에 작성하는 경우는 메서드 선언만 해준다. (단, 메서드명과 Mapper의 id값이 동일해야한다.)
	List<Map<String, Object>> selectRentBookByUserId(String userId);
	
	@Insert("insert into member(user_id, password, tell, email) values(#{userId}, #{password}, #{tell}, #{email})")
	void insertWithDto(Member member);
	
	@Insert("insert into rent_master(rm_idx, user_id, title, rent_book_cnt) values(sc_rm_idx.nextval, #{member.userId}, #{title}, #{rentBookCnt})")
	void insertWithMap(Map<String, Object> commandMap);
	
	@Delete("delete from rent_master where user_id = #{userId}")
	void delete(String userId);
	
	@Update("update member set password = #{password} where user_id = #{userId}")
	void update(Map<String, Object> commandMap);
	
	@Update("{call sp_rent_extend(#{rbIdx, mode=IN})}")
	void procedure(String rbIdx);
	
	void procedureUseTypeHandler(Map<String, Object> commandMap);
	
	@Insert("insert into book(bk_idx, title, author) values(sc_bk_idx.nextval, #{title}, #{author})")
	void test01(Map<String, Object> commandMap);
	
	@Update("update rent_book set extension_cnt = 0 where extension_cnt >= 2")
	void test02();
	
	@Delete("delete from member where reg_date >= '2021/09/01' and reg_date < '2021/10/01'")
	void test03();
	
	List<Map<String, Object>> test04();
	
	List<Map<String, Object>> dynamicIf(Map<String, Object> commandMap);
	
	
	
}
