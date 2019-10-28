import React from "react";
import './History.css';
import APIClient from '../../Actions/apiClient';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';

export default class History extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      isFetchingData: true,
      profile: {}
    }
    this.formatTimeStamp = this.formatTimeStamp.bind(this);
  }
  async componentDidMount() {
    this.apiClient = new APIClient();

    this.apiClient.getAuth().then((data) => {
      this.apiClient.getUserDetails(data.logged_in_as.email).then((data) => {
        this.setState({
          isFetchingData: false,
          profile: data
        })
        console.log(this.state.profile);
      })
    }).catch((err) => { 
      console.log(err)
    })
  }

  formatTimeStamp(timeStamp) {console.log(timeStamp)

  }

  createItems(item) {
  function convertTime(time) {
    let date = new Date(time.$date*1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    return (hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2));
  }
    let startTime = new Date(item.timeStarted.$date);
    let endTime = new Date(item.timeEnded.$date);
    return (    
      <Row key={item._id}>
        <Col sm={4}>   
          <ListGroup.Item action eventKey="first">
            {item.jobName}
          </ListGroup.Item>
        </Col>
        <Col sm={8}>
          <Tab.Content>
            <Tab.Pane eventKey="first">
              <p className="prediction-item">
                Prediction started: {startTime.toLocaleTimeString() + ' ' + startTime.toLocaleDateString()}
              </p>
              <p className="prediction-item">
                Prediction finished: {endTime.toLocaleTimeString() + ' ' + endTime.toLocaleDateString()}
              </p>
              <p className="prediction-item">
                Result: {item.result}
              </p>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    )
  }

  render() {
    if (!this.state.isFetchingData) {
      var historyEntries = this.state.profile.submittedJobs;
      var listItems = historyEntries.map(this.createItems);
    }
    return (
      <div className="container">
        <div className="container-fluid">
        
          <Tab.Container id="list-group-tabs-example">
            {listItems}
          </Tab.Container>
        
        </div>
      </div>
    )
  }
}
