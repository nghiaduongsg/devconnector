import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteComment } from '../../actions/postActions';
import { Link } from 'react-router-dom';
class CommentItem extends Component {
  onDeleteClick() {
    this.props.deleteComment(this.props.postId, this.props.comment._id)
  }
  render() {
    const { comment, postId, auth } = this.props;
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <Link to={`/profile/${comment.user}`}>
              <img className="rounded-circle d-none d-md-block" src={comment.avatar} alt="" />
            </Link>
            <br />
            <p className="text-center">{comment.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{comment.text}</p>
            {comment.user === auth.user.id ? (
                  <button 
                    onClick={this.onDeleteClick.bind(this, postId)}
                    type="button" 
                    className="btn btn-danger mr-1">
                      <i className="fas fa-times" />
                  </button>) 
                : null}
          </div>
        </div>
      </div>
    )
  }
}

CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { deleteComment })(CommentItem);
