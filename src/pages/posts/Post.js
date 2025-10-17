import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from '../../styles/Post.module.css';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Card from 'react-bootstrap/Card';
import Media from 'react-bootstrap/Media';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Link, useHistory } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import { axiosRes } from '../../api/axiosDefaults';
import { MoreDropdown } from '../../components/MoreDropdown';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

const Post = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    likes_count,
    like_id,
    title,
    content,
    image,
    updated_at,
    postPage,
    setPosts,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = useCallback(async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      if (isMounted.current) {
        toast.success('Post deleted successfully!');
        history.push(`/profiles/${profile_id}`);
      }
    } catch (err) {
      if (isMounted.current) {
        toast.error('Error deleting post. Please try again.');
      }
    }
    if (isMounted.current) {
      setShowDeleteModal(false);
    }
  }, [history, id, profile_id]);

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post('/likes/', { post: id });
      if (isMounted.current) {
        setPosts((prevPosts) => ({
          ...prevPosts,
          results: prevPosts.results.map((post) => {
            return post.id === id
              ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
              : post;
          }),
        }));
        toast.success('Post liked!');
      }
    } catch (err) {
      if (isMounted.current) {
        toast.error('Error liking post. Please try again.');
      }
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      if (isMounted.current) {
        setPosts((prevPosts) => ({
          ...prevPosts,
          results: prevPosts.results.map((post) => {
            return post.id === id
              ? { ...post, likes_count: post.likes_count - 1, like_id: null }
              : post;
          }),
        }));
        toast.success('Post unliked!');
      }
    } catch (err) {
      if (isMounted.current) {
        toast.error('Error unliking post. Please try again.');
      }
    }
  };

  const handleKeyPress = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      action();
    }
  };

  return (
    <>
      <Card className={styles.Post}>
        <Card.Body>
          <Media className="align-items-center justify-content-between">
            <Link to={`/profiles/${profile_id}`} className={styles.OwnerLink}>
              <Avatar src={profile_image} height={55} />
              {owner}
            </Link>
            <div className="d-flex align-items-center">
              <span>{updated_at}</span>
              {is_owner && postPage && (
                <MoreDropdown
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              )}
            </div>
          </Media>
        </Card.Body>
        <Link to={`/posts/${id}`}>
          <Card.Img src={image} alt={title} />
        </Link>
        <Card.Body>
          {title && <Card.Title className="text-center">{title}</Card.Title>}
          {content && <Card.Text>{content}</Card.Text>}
          <div className={styles.PostBar}>
            {is_owner ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>You can&apos;t like your own post!</Tooltip>}
              >
                <i className="far fa-heart" />
              </OverlayTrigger>
            ) : like_id ? (
              <span
                onClick={handleUnlike}
                onKeyPress={(e) => handleKeyPress(e, handleUnlike)}
                role="button"
                tabIndex={0}
              >
                <i className={`fas fa-heart ${styles.Heart}`} />
              </span>
            ) : currentUser ? (
              <span
                onClick={handleLike}
                onKeyPress={(e) => handleKeyPress(e, handleLike)}
                role="button"
                tabIndex={0}
              >
                <i className={`far fa-heart ${styles.HeartOutline}`} />
              </span>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Log in to like posts!</Tooltip>}
              >
                <i className="far fa-heart" />
              </OverlayTrigger>
            )}
            {likes_count}
            {currentUser ? (
              <Link to={`/posts/${id}`}>
                <i className="far fa-comments" />
              </Link>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Log in to comment!</Tooltip>}
              >
                <i className="far fa-comments" />
              </OverlayTrigger>
            )}
            {comments_count}
          </div>
        </Card.Body>
      </Card>

      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default Post;
