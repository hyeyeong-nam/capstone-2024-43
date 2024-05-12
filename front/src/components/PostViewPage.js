import ScrollView from "./ScrollView";
import styles from "../css/PostViewPage.module.css";
import React, { useEffect, useState } from 'react';
import { useParams, Route, Routes, useNavigate, Link } from 'react-router-dom';
import EmptyPage from './EmptyPage';
import parse from 'html-react-parser'; // HTML 문자열을 React 구성 요소로 변환

function PostViewPage() {
  const {postId}=useParams();
  const [data,setData]=useState({});
  const [_li,set_Li]=useState([]);
  const [bookInfoContainerDisplay,setbookInfoContainerDisplay] = useState("none");
  const [buttonDisplay,setButtonDisplay] = useState("block");
  const [bookData, setBookData] = useState({});
  const UID = localStorage.getItem('UID')
  const navigate = useNavigate();


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });//화면 맨 위로 이동
    changeBlurBoxState();//blurBox state변경
    if (postId) { // postID가 존재하는 경우에만 fetch 요청 보냄
      fetch(`http://localhost:8080/api/post/${postId}`,{
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({UID:UID})
      })
        .then(res => res.json())
        .then(json => {
          console.log("json: ",json);
          console.log("json[0]:", json[0]);
          setData(json[0]);
          fetchBookInfo(json[0].isbn); // postId에 해당하는 책 정보 가져오기
          return json[0];
        })
        .then((data)=>{
          console.log("data: ",data);
          const li_ = [];
          li_.push(<li>제목: {data.name}</li>);
          li_.push(<li>작가: {data.author}</li>);
          li_.push(<input type='hidden' name='q' value={data.name}></input>);
          li_.push(<li><button onClick={()=>{navigate('/post',{state: {isbn: data.isbn}})}}>같은 책으로 후기 쓰러가기</button></li>);
          set_Li(prev_Li=>[...prev_Li,...li_]);
        })
        .catch(error => console.log(error));
    }
  }, [postId]);

  function changeBlurBoxState(){
    setbookInfoContainerDisplay(bookInfoContainerDisplay==="flex"?"none":"flex");
    setButtonDisplay(buttonDisplay==="block"?"none":"block");
    document.documentElement.style.setProperty('--bookInfoContainer-display',bookInfoContainerDisplay);
    document.documentElement.style.setProperty('--button-display',buttonDisplay);
  }

  function handleEdit() {
    if (postId) {
      navigate(`/post/edit/${postId}`);
    }
  }

  function handleDelete() {
    if (postId) {
      fetch(`http://localhost:8080/api/post/${postId}`, {
        method: 'DELETE',
      })
        .then(res => {
          if (res.ok) {
            alert('성공적으로 삭제되었습니다!');
            navigate(`/`);
          } else {
            alert('삭제하는데 실패했습니다.');
          }
        })
        .catch(error => console.error('포스트를 삭제하는데 오류가 발생했습니다:', error));
    }
  }

  function fetchBookInfo(isbn) {
    if (isbn) {
      fetch(`http://localhost:8080/api/books/search/${isbn}`)
        .then(res => res.json())
        .then(json => {
          console.log("bookData:", json);
          setBookData(json[0]);
        })
        .catch(error => console.log(error));
    }
  }
  return (
    <>
      <article>
        <div className={styles.postBox}>
          {/* data가 로드되지 않았거나 body가 없는 경우를 고려하여 조건부 렌더링 */}
          {data ? (
           <>
            {<h1>{data.title}</h1>}
            {UID && data.UID && (UID.toString() === data.UID.toString()) && (
              <div className={styles.buttoncontainer}>
                <button className={styles.editButtons} onClick={handleEdit}>수정</button>
                <button className={styles.editButtons} onClick={handleDelete}>삭제</button>
              </div>
            )}
            {<h1> </h1>}
            {data.body && parse(data.body)}
           </>
          ) : (
           <Routes>
            <Route path="*" element={<EmptyPage />} />
           </Routes>
          )}
        </div>
      </article>


    <div className={styles.bookInfoBox}>
        <button className={styles.stateButton} onClick={changeBlurBoxState}>책 정보 확인하기</button>
        <div className={styles.bookInfoContainer}>
      <div className={styles.bookImg}>
        {/* <img src="" alt="bookImg"></img> */}
      </div>
      <div className={styles.bookInfo}>
      <form action="https://www.google.com/search" method="get" target="_blank">
        <ul className={styles.ul}>
          {_li}
          <li><button type="submit">책 정보 검색</button></li>
        </ul>
      </form>
      </div>
      </div>
    </div>
    <hr className={styles.line}></hr>
    <ScrollView/>
    </>
  );
}

export default PostViewPage;
