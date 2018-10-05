import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class MessageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: this.props.initiallyOpen
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.props.title}</ModalHeader>
          <ModalBody>
            {this.props.children}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>{'OK'}</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default MessageBox;
