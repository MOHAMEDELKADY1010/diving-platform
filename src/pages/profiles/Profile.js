import React from 'react';
import styles from '../../styles/Profile.module.css';
import btnStyles from '../../styles/Button.module.css';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import { Button } from 'react-bootstrap';
import { useSetProfileData } from '../../contexts/ProfileDataContext';
import { toast } from 'react-toastify';

const Profile = (props) => {
  const { profile, mobile, imageSize = 55 } = props;
  const { id, following_id, image, owner } = profile;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const { handleFollow, handleUnfollow } = useSetProfileData();

  const handleFollowClick = async () => {
    try {
      await handleFollow(profile);
      toast.success(`You are now following ${owner}.`);
    } catch (err) {
      console.error('Follow error:', err);
      toast.error(
        err.response?.data?.detail ||
          'An error occurred while trying to follow. Please try again.'
      );
    }
  };

  const handleUnfollowClick = async () => {
    try {
      await handleUnfollow(profile);
      toast.warning(
        `You have unfollowed ${owner}. You will no longer see their posts.`
      );
    } catch (err) {
      console.error('Unfollow error:', err);
      toast.error(
        err.response?.data?.detail ||
          'An error occurred while trying to unfollow. Please try again.'
      );
    }
  };

  return (
    <div
      className={`my-3 d-flex align-items-center ${mobile && 'flex-column'}`}
    >
      <div>
        <Link className="align-self-center" to={`/profiles/${id}`}>
          <Avatar src={image} height={imageSize} />
        </Link>
      </div>
      <div className={`mx-2 ${styles.WordBreak}`}>
        <strong>{owner}</strong>
      </div>
      <div className={`text-right ${!mobile && 'ml-auto'}`}>
        {currentUser &&
          !is_owner &&
          (following_id ? (
            <Button
              className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
              onClick={handleUnfollowClick}
            >
              unfollow
            </Button>
          ) : (
            <Button
              className={`${btnStyles.Button} ${btnStyles.Black}`}
              onClick={handleFollowClick}
            >
              follow
            </Button>
          ))}
      </div>
    </div>
  );
};

export default Profile;
