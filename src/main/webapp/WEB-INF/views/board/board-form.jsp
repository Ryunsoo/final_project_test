<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<%-- <%@ include file="/WEB-INF/views/include/head.jsp" %> --%>
<link href="/resources/css/board.css" rel="stylesheet">
<!-- <link href="/resources/css/text-edit/summernote-lite.css" rel="stylesheet"> -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="/resources/js/text-edit/summernote-ko-KR.js"></script>
<!-- <script type="text/javascript" src="/resources/js/text-edit/summernote-lite.js"></script> -->
<link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js"></script>
</head>
<body>

<div class="content">
   <h2 class="tit">*게시판</h2>
   <div class="desc_board">
      <form action="${contextPath}/board/upload" method="post" enctype="multipart/form-data">
			제목 : <input type="text" name="title" required="required"/>
			<br>
            <textarea id="summernote" name="content"></textarea>
            <button style="background-color:red; color:white; width:100%">전송</button>
      </form>
   </div>
</div>
<script>
      $('#summernote').summernote({
    	lang: 'ko-KR',
        placeholder: 'Hello stand alone ui',
        tabsize: 2,
        height: 300,
        minHeight: 300,
        maxHeight: 500,
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'underline', 'clear']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['table', ['table']],
          ['insert', ['link', 'picture', 'video']],
          ['view', ['fullscreen', 'codeview', 'help']]
        ]
      });
      
      var markupStr = $('#summernote').summernote('code');
    </script>
</body>
</html>