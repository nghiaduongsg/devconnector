import React, { Component } from 'react'
import isEmpty from '../../validation/is-empty';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

class ProfileCreds extends Component {
  render() {
    const { experience, education } = this.props;

    const expItem = experience.map(exp => (
      <li className="list-group-item mb-4">
        <h4>{exp.company}</h4>
        <p>
        <Moment format="DD/MM/YYYY">{exp.from}</Moment>{" - "}
        {exp.to === null ? ('Now') : <Moment format="DD/MM/YYYY">{exp.to}</Moment>}
        </p>
        <p>
          <strong>Position: </strong> 
          {exp.title}
        </p>
        {isEmpty(exp.location) ? null : (<p><strong>Location: </strong>{exp.location}</p>)}
        {isEmpty(exp.description) ? null : (<p><strong>Description: </strong>{exp.description}</p>)}
      </li>
    ))
    const eduItem = education.map(edu => (
      <li className="list-group-item mb-4">
        <h4>{edu.school}</h4>
        <p>
        <Moment format="DD/MM/YYYY">{edu.from}</Moment>{" - "}
        {edu.to === null ? ('Now') : <Moment format="DD/MM/YYYY">{edu.to}</Moment>}
        </p>
        <p>
          <strong>Degree: </strong> 
          {edu.degree}
        </p>
        <p>
          <strong>Field of Study: </strong>
          {edu.fieldofstudy}
        </p>
        {isEmpty(edu.description) ? null : (<p><strong>Description: </strong>{edu.description}</p>)}
      </li>
    ))

    return (
      <div class="row">
        <div class="col-md-6">
          <h3 class="text-center text-info">Experience</h3>
          <ul class="list-group">
            {expItem}
          </ul>
        </div>
        <div class="col-md-6">
          <h3 class="text-center text-info">Education</h3>
          <ul class="list-group">
            {eduItem}
          </ul>
        </div>
      </div>  
    )
  }
}

ProfileCreds.propTypes = {
  experience: PropTypes.object.isRequired,
  education: PropTypes.object.isRequired
}

export default ProfileCreds;