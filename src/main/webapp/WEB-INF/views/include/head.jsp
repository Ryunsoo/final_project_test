<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!-- spring이 제공하는 form 태그를 사용할 수 있게 해준다. -->
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<c:set var="contextPath" value="${pageContext.request.contextPath}"/>

<meta charset="UTF-8">
<link rel="stylesheet" href="${contextPath}/resources/css/all.css">
<script type="text/javascript" src="${contextPath}/resources/js/web-util.js"></script>
<script type="text/javascript" src="${contextPath}/resources/js/urlEncoder.js"></script>
<title>JSP-Study</title>
