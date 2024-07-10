import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const PostComment = ({
  id,
  postId,
  title,
  author,
  initialUpvotes,
  initialDownvotes,
  date,
  onDelete,
}) => {
  const usuario = JSON.parse(localStorage.getItem("usuario")) || undefined;
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState(null);
  const [authorProfilePicture, setAuthorProfilePicture] = useState("");

  useEffect(() => {
    if (usuario) {
      if (usuario.upComments.includes(id)) {
        setUserVote("upvote");
      } else if (usuario.downComments.includes(id)) {
        setUserVote("downvote");
      }
    }
  }, [id, usuario]);

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem("usuarios")) || [];
    const authorData = allUsers.find((user) => user.username === author);

    if (authorData) {
      setAuthorProfilePicture(
        authorData.profilePicture || "https://via.placeholder.com/150"
      );
    }
  }, [author]);

  const updateLocalStorage = (newUpvotes, newDownvotes) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const post = posts.find((post) => post.id.toString() === postId.toString());

    const comments = post.comments || [];

    if (comments.length > 0) {
      const commentIndex = comments.findIndex((comment) => comment.id === id);
      comments[commentIndex].upvotes = newUpvotes;
      comments[commentIndex].downvotes = newDownvotes;
    } else {
      comments.push({
        id,
        postId,
        title,
        author,
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        date,
      });
    }

    post.comments = comments;
    posts[posts.findIndex((post) => post.id.toString() === postId.toString())] =
      post;
    localStorage.setItem("posts", JSON.stringify(posts));
  };

  const handleUpvote = () => {
    let newUpvotes = upvotes;
    let newDownvotes = downvotes;

    if (userVote === "upvote") {
      if (newUpvotes > 0) newUpvotes -= 1;
      setUserVote(null);
      usuario.upComments = usuario.upComments.filter(
        (commentId) => commentId !== id
      );
    } else if (userVote === "downvote") {
      if (newDownvotes > 0) newDownvotes -= 1;
      newUpvotes += 1;
      setUserVote("upvote");
      usuario.downComments = usuario.downComments.filter(
        (commentId) => commentId !== id
      );
      usuario.upComments.push(id);
    } else {
      newUpvotes += 1;
      setUserVote("upvote");
      usuario.upComments.push(id);
    }

    setUpvotes(newUpvotes);
    setDownvotes(newDownvotes);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem(
      "usuarios",
      JSON.stringify(
        JSON.parse(localStorage.getItem("usuarios")).map((u) =>
          u.username === usuario.username ? usuario : u
        )
      )
    );
    updateLocalStorage(newUpvotes, newDownvotes);
  };

  const handleDownvote = () => {
    let newUpvotes = upvotes;
    let newDownvotes = downvotes;

    if (userVote === "downvote") {
      if (newDownvotes > 0) newDownvotes -= 1;
      setUserVote(null);
      usuario.downComments = usuario.downComments.filter(
        (commentId) => commentId !== id
      );
    } else if (userVote === "upvote") {
      if (newUpvotes > 0) newUpvotes -= 1;
      newDownvotes += 1;
      setUserVote("downvote");
      usuario.upComments = usuario.upComments.filter(
        (commentId) => commentId !== id
      );
      usuario.downComments.push(id);
    } else {
      newDownvotes += 1;
      setUserVote("downvote");
      usuario.downComments.push(id);
    }

    setUpvotes(newUpvotes);
    setDownvotes(newDownvotes);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem(
      "usuarios",
      JSON.stringify(
        JSON.parse(localStorage.getItem("usuarios")).map((u) =>
          u.username === usuario.username ? usuario : u
        )
      )
    );
    updateLocalStorage(newUpvotes, newDownvotes);
  };

  const handleDelete = () => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const post = posts.find((post) => post.id.toString() === postId).toString();
    const comments = post.comments || [];
    const updatedComments = comments.filter((comment) => comment.id !== id);
    post.comments = updatedComments;
    posts[posts.findIndex((post) => post.id.toString() === postId)] = post;
    localStorage.setItem("posts", JSON.stringify(posts));
    onDelete(id);
  };

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const post = posts.find((post) => post.id.toString() === postId.toString());

    if (post) {
      const storedComment = post.comments.find((comment) => comment.id === id);
      if (storedComment) {
        setUpvotes(storedComment.upvotes);
        setDownvotes(storedComment.downvotes);
      }
    }
  }, [postId, id]);

  return (
    <Row className="gy-3">
      <Col className="p-3 m-auto">
        <Container
          id="comment-container"
          className="border border-dark-subtle bg-light"
          role="region"
          aria-labelledby="comment-title"
        >
          <Row>
            <Col className="border-end border-dark-subtle p-3">
              <Row>
                <Col>
                  <Row>
                    <p
                      id="comment-title"
                      style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {title}
                    </p>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row className="p-3">
                <Col className="text-center" tabIndex="0">
                  <Button
                    disabled={!usuario}
                    className="btn"
                    onClick={handleUpvote}
                    variant={userVote === "upvote" ? "success" : "primary"}
                    aria-label="Votar positivamente"
                  >
                    +
                  </Button>
                  <Row>
                    <span className="h5">Votos positivos</span>
                  </Row>
                  <Row>
                    <p>{upvotes}</p>
                  </Row>
                </Col>
                <Col className="text-center" tabIndex="0">
                  <Button
                    className="btn"
                    disabled={!usuario}
                    onClick={handleDownvote}
                    variant={userVote === "downvote" ? "danger" : "primary"}
                    aria-label="Votar negativamente"
                  >
                    -
                  </Button>
                  <Row>
                    <span className="h5">Votos negativos</span>
                  </Row>
                  <Row>
                    <p>{downvotes}</p>
                  </Row>
                </Col>
                <Col className="text-center">
                  <Row>
                    <Col>
                      <img
                        src={authorProfilePicture}
                        alt="author profile"
                        width="30"
                        height="30"
                        style={{ marginRight: "10px", borderRadius: "50%" }}
                      />
                      <NavLink
                        className="custom-text-link"
                        to={`/perfil/${author}`}
                        aria-label={`Perfil de ${author}`}
                        tabIndex="0"
                      >
                        <span>{author}</span>
                      </NavLink>
                    </Col>
                  </Row>
                  <Row>
                    <p>{new Date(date).toLocaleString()}</p>
                  </Row>
                </Col>
                <Col className="text-center">
                  {usuario === undefined || usuario.username !== author ? (
                    <div></div>
                  ) : (
                    <Button
                      aria-label="Eliminar"
                      className="btn btn-danger"
                      onClick={handleDelete}
                    >
                      <i className="bi bi-trash"></i>
                      <span>Eliminar</span>
                    </Button>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </Col>
    </Row>
  );
};

export default PostComment;
