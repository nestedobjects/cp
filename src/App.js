import React, {Component} from 'react';
import {
  Header,
  Divider,
  Form,
  TextArea,
  Button,
  Modal,
  Loader,
  Dimmer,
  Input,
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import {CopyToClipboard} from 'react-copy-to-clipboard';
const QRCode = require('qrcode.react');
const styles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily: "'Raleway', sans-serif",
    fontSize: 14,
  },
  button: {
    background: 'rgb(9, 3, 0)',
  },
  heading: {
    paddingTop: 10,
    textAlign: 'center',
    background: 'rgba(0,0,0,.87)',
    color: '#fff',
    padding: '14px',
    letterSpacing: '0.4rem',
    fontSize: '21px',
  },
  subHeading: {
    paddingTop: 10,
    textAlign: 'center',
  },
  areaHeight: {
    minHeight: 400,
    fontFamily: "'Raleway', sans-serif",
    fontSize: 14,
    backgroundColor: '#090300',
    color: '#fff',
    boxShadow: 'rgba(0, 0, 0, 0.55) 0px 20px 68px',
    outline: 'none',
  },
  areaPadding: {
    padding: 20,
  },
  areaAction: {
    width: '100%',
    textAlign: 'center',
  },
  input: {
    cursor: 'pointer',
  },
  copyStatus: {
    background: '#c3c3c3',
    padding: 4,
    marginLeft: 5,
    fontSize: 10,
    borderRadius: 5,
  },
  copyWidth: {
    width: 230,
  },
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaContent: '',
      link: '',
      copied: false,
      status: '',
    };
  }
  getTinyUrl() {
    this.setState({link: '', status: ''});
    const dynamicLink = {
      longDynamicLink: `https://cpjs.page.link/?link=${window.location.href}`,
      suffix: {
        option: 'SHORT',
      },
    };
    fetch(
      'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyBiOe8HRoH0KQR5tkgP3Qna_JZCVc7bnz0',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dynamicLink),
      },
    )
      .then(res => {
        if (res.status === 200) return res.json();
        else return res;
      })
      .then(res => {
        if (res.shortLink) this.setState({link: res.shortLink});
        else this.setState({status: 'Something wrong in the server!'});
      })
      .catch(err => {
        this.setState({status: 'Something wrong in the server!'});
      });
  }
  componentWillMount() {
    this.setState({
      areaContent: decodeURIComponent(
        decodeURIComponent(window.location.search.substring(1)),
      ).replace(/\+/g, ' '),
    });
  }
  createLink(e) {
    window.history.replaceState(
      null,
      null,
      `/?${encodeURIComponent(e.target.value)}`,
    );
    this.setState({areaContent: e.target.value});
  }
  render() {
    return (
      <div className="App" style={styles.body}>
        <Header as="h2" content="cp(Copy-Paste)" style={styles.heading} />
        <Header
          as="h4"
          content="Copy paste across the devices with ease"
          style={styles.subHeading}
        />
        <Form style={styles.areaPadding}>
          <TextArea
            autoHeight
            onChange={this.createLink.bind(this)}
            maxLength="7168"
            style={styles.areaHeight}
            placeholder="Try adding some links/text"
            value={this.state.areaContent}
          />
        </Form>
        <div style={styles.areaAction}>
          <Modal
            trigger={
              <Button
                content="Copy"
                primary
                style={styles.button}
                onClick={this.getTinyUrl.bind(this)}
              />
            }>
            <Modal.Header>
              {this.state.status.length ? (
                <span>Something went wrong!</span>
              ) : (
                <span>Congrats! Your links are ready!!!</span>
              )}
            </Modal.Header>
            <Modal.Content>
              <Modal.Description style={styles.areaAction}>
                {this.state.link.length === 0 &&
                this.state.status.length === 0 ? (
                  <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                  </Dimmer>
                ) : this.state.status.length !== 0 ? (
                  <span>{this.state.status}</span>
                ) : this.state.link.length !== 0 ? (
                  <div>
                    {' '}
                    <QRCode value={this.state.link} /> <br />
                    (or)
                    <br />
                    <br />
                    <CopyToClipboard
                      text={this.state.link}
                      onCopy={() => this.setState({copied: true})}>
                      <span style={styles.input}>
                        <Input
                          icon="copy outline"
                          style={styles.copyWidth}
                          iconPosition="right"
                          value={this.state.link}
                          readOnly
                        />
                      </span>
                    </CopyToClipboard>
                    {this.state.copied ? (
                      <span style={styles.copyStatus}>Copied!</span>
                    ) : null}
                  </div>
                ) : null}
                {this.state.status.length ? (
                  <span>
                    <br />
                    <br />
                    Read more about unsupported Characters at{' '}
                    <a
                      href="http://unicode.org/faq/unsup_char.html"
                      rel="noopener noreferrer"
                      target="_blank">
                      unicode.org/faq/unsup_char.html
                    </a>
                  </span>
                ) : null}
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </div>
      </div>
    );
  }
}

export default App;
