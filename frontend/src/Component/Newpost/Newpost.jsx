import React, {useEffect, useState} from 'react'
import { Button, Typography } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import'./Newpost.css'
import { newpost } from '../../Actions/Post'
import {useAlert} from 'react-alert'
import { getMyPosts } from '../../Actions/User'
const Newpost = () => {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('');
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImage(reader.result)
            }
        }
        reader.readAsDataURL(file);

    }

    const { loading, message, error } = useSelector(state => state.like);
    const dispatch = useDispatch();
    const alert = useAlert()
    const upload = async(e) => {
        e.preventDefault();
        await dispatch(newpost(caption, image))
        dispatch(getMyPosts())
    }
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch({type:"clearErrors"})
        }
        if (message) {
            alert.success(message)
            dispatch({type:"clearMessages"})
        }
    }, [alert, message, dispatch, error])
    
  return (
      <div className="newPost">
          <form className="newPostForm" onSubmit={upload}>
              <Typography variant='h3'>New Post</Typography>
              {image && <img src={image} alt='post' />}
              <input type="file" accept='image/*' onChange={handleImageChange} />
              <input type="text" placeholder='Caption' value={caption} onChange={e=>setCaption(e.target.value)} />
              <Button disabled={loading} type='submit'>Post</Button>
          </form>
    </div>
  )
}

export default Newpost
