import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config'
import { useDispatch } from 'react-redux'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import Loading from '../Components/LoadingComponent'

const TweetdetailPage = () => {
    // Defining States
    const [data, setTweetData] = useState([])
    const location = useLocation();
    const [reply, setReply] = useState([]);
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const users = JSON.parse(localStorage.getItem('user'));

    const tweetid = location.state;
    // console.log(location.stat);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Function to clear user authentication data from local storage and dispatch a logout action
    const clearstore = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGIN_ERROR" });
    }

    const edit=async()=>{
        try {
            const request= {Content:content,Image:image, postId:tweetid}

            const response=await axios.put(`${API_BASE_URL}/updatepost`,request)
            singleTweet();
        } catch (error) {
            Swal.fire({
                icon: "info",
                title: "Edited"
            })
            console.log(error);
        }
    }


    // Function to handle user logout
    const logout = () => {
        clearstore();
    }
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }


    // Function to like the user
    const like = async (tweetid) => {
        console.log(tweetid);
        try {
            const request={postid: tweetid, userId:users._id}
            const response = await axios.put(`${API_BASE_URL}/like`,request);
            singleTweet();
        } catch (error) {
            Swal.fire({
                icon: "info",
                title: "Already Liked"
            })
            console.log(error);
        }
    }
// Function to unlike the user
    const unlike = async (tweetid) => {
        console.log(tweetid);
        try {
            const request={postid: tweetid, userId:users._id}
            const response = await axios.put(`${API_BASE_URL}/unlike`,request);
            singleTweet();
        } catch (error) {
            Swal.fire({
                icon: "info",
                title: "Already Liked"
            })
            console.log(error);
        }
    }

    // Function to post reply
    const replies = async () => {
        const request = {
            commentText: reply,
            postId:tweetid,
            userId:users._id
        }
        const response = await axios.put(`${API_BASE_URL}/comment`, request)
            .then((data) => {
                Swal.fire({
                    icon: 'success',
                    title: "Replied Successfully"
                })
                singleTweet();
                // replytweet();
            })
            .catch((error) => {
                console.log(error);
            })

    }
  

    // Function to fetch single tweet

    const singleTweet = async () => {
        const response = await axios.get(`${API_BASE_URL}/Tweetbyid/${tweetid}`);
        console.log(response);
        if (response.status === 200) {
            setTweetData(response.data.posts);
            // setReplyId(response.data.posts.comments)
        }
    }
    // useEffect(() => {
        // replytweet()
    // }, [replyId])


    useEffect(()=>{
        singleTweet()
    },[]);
    useEffect(() => {
        // Simulate an API call
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    // Display loading component while data is being fetched
    if (isLoading) {
        return <Loading />;
    }
    return (
        // Structure of tweet detail page
        <div>
            <div className='row d-flex w-100'>
                <div className='col-md-2'>
                    <div style={{ position: "sticky", top: "0" }}>
                        <div className='d-flex align-items-start py-3 ps-3' ><i className="text-primary shadow fs-1 fa-brands fa-twitter"></i></div>
                        <div className='d-flex desktop mt-3 w-75 justify-content-between flex-column'>
                            <div className='d-flex justify-content-between '><NavLink className='text-decoration-none text-dark' to={'/home'}><i className="fa-solid fa-house py-2 px-3"></i>Home</NavLink></div>
                            <div className='d-flex justify-content-between '><NavLink to={'/'} className='text-decoration-none text-dark' onClick={() => logout()}><i className="fa-solid fa-right-from-bracket py-2 px-3"></i>Logout</NavLink></div>
                        </div>
                    </div>

                    <div className='d-flex w-75 mobile justify-content-between'>
                        <div className='d-flex justify-content-between align-items-center'><NavLink className='text-decoration-none text-dark' to={'/home'}><i className="fa-solid fa-house px-2 py-2"></i>Home</NavLink></div>
                        <div className='d-flex justify-content-between  align-items-center'><NavLink className='text-decoration-none text-dark' to={'/'} onClick={() => logout()}><i className="fa-solid fa-right-from-bracket px-2 py-2"></i>Logout</NavLink></div>
                    </div>
                </div>
                <div className='col-md-10'>
                <div className='row'>
                        <div className='col d-flex justify-content-between'>
                            <span className='mx-2 fw-bold fs-3'>Home</span>
                            <button data-toggle="modal" data-target="#editModal" type='button' className='mx-4 btn btn-primary text-light'>Edit Post</button>
                        </div>
                    </div>
                    <div className='fw-bold fs-2 text-start my-3 ms-2'>Tweet</div>
                    {/* Fetching data contitionally */}
                    {data && Object.keys(data).length !== 0 && (
                        <>
                            <div className="card w-100 d-flex flex-column" >
                                <div className='w-100 d-flex flex-row align-content-center'>
                                    <span className='pt-2 fw-bold ps-2'>{users.UserName}</span>
                                    <span className='pt-2 ps-2'>{moment(data.createdAt).format('DD/MM/YYYY HH:MM')}</span>
                                </div>
                                <div className='d-flex mt-3 flex-column align-items-center justify-content-center ps-3'>
                                    <p className='fs-5' >{data.Content}</p>
                                    {data.Image && <img style={{ height: "300px", width: "60%" }} src={data.Image} alt='Tweet Image' />}
                                </div>
                                <div className='w-100 d-flex align-items-start'>
                                    <span onClick={() => like()}><i className="px-3 text-danger fa-regular fa-heart"></i>{data.Likes.length}</span>
                                    <span onClick={() => unlike()}><i class="px-3 fa-solid fa-heart-crack"></i></span>
                                    <span><i className="px-3 fa-regular text-primary fa-comment"></i>{data.comments.length}</span>
                                    <span data-toggle="modal" data-target="#replyModal"><i class="px-3 fa-solid fa-reply"></i>{data.comments.length}</span>
                                </div>
                            </div>

                        </>
                    )
                    }
                    {/* Fetching reply on the tweet */}
                    <div className='fw-bold fs-2 text-start my-3 ms-2'>Replies</div>
                            {data.comments.map((info) => {
                                return (
                                    <div style={{height:"50px"}} className="card my-2 w-100 d-flex flex-column" >
                                        <div className='d-flex justify-content-center'>
                                            <p>{info.commentText}</p>
                                        </div>
                                    </div>)
                            })}
                </div>

            </div>
            {/* Modal for reply tweet */}
            {/* <!-- Modal --> */}
            <div className="modal fade" id="replyModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Reply</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className='col-12'>
                                <textarea class="form-control" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Let's Reply" id="floatingTextarea"></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-dark" data-dismiss="modal">Close</button>
                            <button type="button" onClick={() => replies()} className="btn btn-primary" data-dismiss="modal">Save</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Reply</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className='col-12'>
                                <textarea className="form-control mb-3" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Let's Tweet" id="floatingTextarea"></textarea>
                                <input placeholder='Provide Image Link' value={image} name="text" type="text" id="drop_zone" onChange={(e) => setImage(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-dark" data-dismiss="modal">Close</button>
                            <button type="button" onClick={edit} className="btn btn-primary" data-dismiss="modal">Tweet</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TweetdetailPage
