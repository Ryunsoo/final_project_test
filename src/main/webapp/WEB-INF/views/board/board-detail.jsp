<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<%-- <%@ include file="/WEB-INF/views/include/head.jsp" %> --%>
<link href="/resources/css/board/board.css" rel="stylesheet">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<!-- <script type="text/javascript" src="/resources/js/text-edit/summernote-ko-KR.js"></script> -->
<link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js"></script>
</head>
<body>
	<div class="content">
		<h2 class="tit">게시판</h2>
		<div class="info">
			<span>번호 : <c:out value="${board.bdIdx}"/></span>
			<span>제목 : <c:out value="${board.title}"/></span>
			<span>등록일 : <c:out value="${board.regDate}"/></span>
			<span>작성자 : <c:out value="${board.userId}"/></span>
		</div>
		<div class="info file_info">
			<c:if test="${not empty files}">
				<ol>
					<c:forEach items="${files}" var="file">
						<li>
							<a onclick="downloadQueryString('${file.originFileName}', '${file.renameFileName}', '${file.savePath}')">${file.originFileName}</a>
						</li>
					</c:forEach>
				</ol>
			</c:if>
		</div>
	</div>
	<div id="summernote" name="content"></div>
<script type="text/javascript">
	let downloadQueryString = (originFileName, renameFileName, savePath) => {
		
		let paramObj = {'originFileName':originFileName
				, 'renameFileName':renameFileName
				, 'savePath':savePath};
		
		location.href = '/download?' + urlEncoder(paramObj);
	}
	
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
      var HTMLstring = '${board.content}';
      $('#summernote').summernote('pasteHTML', HTMLstring);
</script>

</body>
</html>