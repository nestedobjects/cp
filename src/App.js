import React, { Component } from 'react';
import { Header,Divider,Form, TextArea, Button, Modal, Loader, Dimmer, Input } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import { BitlyClient } from 'bitly';
import {CopyToClipboard} from 'react-copy-to-clipboard';
const bitly = new BitlyClient('<accesskey>', {});
const QRCode = require('qrcode.react');
const styles = {
  body: {
      margin: 0,
      padding: 0,
      fontFamily: "'Raleway', sans-serif",
      fontSize: 14
    },
    heading: {
      paddingTop: 10,
      textAlign: "center"
    },
    areaHeight: {
      minHeight: 400,
      fontFamily: "'Raleway', sans-serif",
      fontSize: 14
    },
    areaPadding: {
      padding: 20
    },
    areaAction: {
      width: "100%",
      textAlign: "center"
    },
    input: {
      cursor: 'pointer'
    },
    copyStatus: {
      background: "#c3c3c3",
      padding: 4,
      marginLeft: 5,
      fontSize: 10,
      borderRadius: 5
    }
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaContent: '',
      link: '',
      copied: false
    }
  }
  getTinyUrl() {
    bitly
      .shorten(encodeURI(window.location.href))
      .then((result) => {
        if(result.url) {
          this.setState({link: result.url});
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } 
  componentWillMount() {
    this.setState({areaContent: decodeURI(decodeURI(window.location.search.substring(1)))})
  }
  createLink(e) {
    window.history.replaceState(null, null, `/?${encodeURI(e.target.value)}`);
    this.setState({areaContent: e.target.value});
  }
  render() {
    return (
      <div className="App" style={styles.body}>
          <Header as='h2' content='Copy' style={styles.heading} />
          <Header as='h6' content="Copy paste across the devices with ease" style={styles.heading} />
          <Divider />
          <Form style={styles.areaPadding}>
            <TextArea autoHeight onChange={this.createLink.bind(this)} style={styles.areaHeight} placeholder='Try adding some links/text' value={this.state.areaContent} />
          </Form>
          <div style={styles.areaAction}>
          <Modal
            trigger={<Button content='Copy' primary onClick={this.getTinyUrl.bind(this)} />}>
              <Modal.Header>You're ready to share!!!</Modal.Header>
                  <Modal.Content >
                    <Modal.Description style={styles.areaAction}>
                        <QRCode value={window.location.href} />
                        {(this.state.link.length === 0 ? <Dimmer active inverted>
                          <Loader inverted>Loading</Loader>
                        </Dimmer> : <div><br/>(or)<br/><br/><CopyToClipboard text={this.state.link}
                                    onCopy={() => this.setState({copied: true})}>
                                    <span style={styles.input} ><Input icon='copy outline' iconPosition='right' value={this.state.link} readOnly /></span>
                                  </CopyToClipboard>{this.state.copied? <span style={styles.copyStatus}>Copied!</span>: null}</div>)}
                    </Modal.Description>
                  </Modal.Content>
            </Modal>
          </div>
      </div>
    );
  }
}

export default App;
