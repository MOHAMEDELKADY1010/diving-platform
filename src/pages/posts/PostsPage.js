import React, { useEffect, useState, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Post from './Post';
import Asset from '../../components/Asset';
import appStyles from '../../App.module.css';
import styles from '../../styles/PostsPage.module.css';
import { useLocation } from 'react-router';
import { axiosReq } from '../../api/axiosDefaults';
import NoResults from '../../assets/no-results.png';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchMoreData } from '../../utils/utils';
import PopularProfiles from '../profiles/PopularProfiles';

function PostsPage({ message, filter = '' }) {
  const [posts, setPosts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const currentUser = useCurrentUser();
  const [query, setQuery] = useState('');

  const fetchPosts = useCallback(async () => {
    try {
      const { data } = await axiosReq.get(`/posts/?${filter}search=${query}`);
      setPosts(data);
      setHasLoaded(true);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  }, [filter, query]);

  useEffect(() => {
    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchPosts();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser, fetchPosts]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <div className={styles.SearchBar}>
          <i className={`fas fa-search ${styles.SearchIcon}`} />
          <Form
            onSubmit={(event) => event.preventDefault()}
            className={styles.SearchForm}
          >
            <Form.Control
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              className="mr-sm-2"
              placeholder="Search posts"
            />
          </Form>
        </div>

        {hasLoaded ? (
          <>
            {posts.results.length ? (
              <InfiniteScroll
                dataLength={posts.results.length}
                loader={<Asset spinner />}
                hasMore={!!posts.next}
                next={() => fetchMoreData(posts, setPosts)}
              >
                {posts.results.map((post) => (
                  <Post key={post.id} {...post} setPosts={setPosts} />
                ))}
              </InfiniteScroll>
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default PostsPage;
