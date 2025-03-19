import { MainCard } from 'components/MainCard'
import React from 'react'

const Faq = () => {
  return (
    <MainCard
      title="Instructions & FAQ"
      subtitle="Here you can understand how to use the application and exploit its full potential! "
    >
      <h2>About</h2>
      <p>
        The PRAISE application is designed to support pharmacists in programming
        robotic systems for the preparation of galenic formulations. This
        user-friendly tool streamlines the process of creating customized
        pharmaceutical preparations using two different approaches: a{' '}
        <b>Chat</b> and a <b>Graphic Interface</b>.
      </p>
      <p>
        In the Chat you can assemble all the defined libraries or define new
        ones to create a preparation interacting only in natural language.
      </p>
      <p>
        {' '}
        In the Graphic interface you can create or edit a preparation
        interacting with a flow diagram.
      </p>
      <h2>Steps</h2>
      <p>
        The preparation is divided into 3 main steps: <b>Mixing</b>,{' '}
        <b>Packaging</b> and <b>Storaging</b>. For each step you can define a
        library for performing the operations.
      </p>
      <ul>
        <li>
          <b>Mixing</b>: in this step you can define the operations for mixing
          the ingredients of the preparation. You can define the <b>Action</b>{' '}
          with its details:
          <ul>
            <li>
              <i>Name</i>: the name of the action
            </li>
            <li>
              <i>Shared</i>: if the action is shared with other users
            </li>
            <li>
              <i>Keywords</i>: keywords used as synonyms for refer the action
            </li>
            <li>
              <i>Time</i>: the time required to perform the action or if you
              prefer to loop the action untile the user stops it
            </li>
            <li>
              <i>Speed</i>: the speed of the action
            </li>
            <li>
              <i>Pattern</i>: use an already defined pattern of the action
              (Linear, Circular, Cross, Helix)
            </li>
            <li>
              <i>Tool</i>: the tool to use to perform the action (Spatula,
              Pestle, Flask)
            </li>
            <li>
              <i>Height</i>: the height acquired from the robot at which to
              perform the action
            </li>
            <li>
              <i>Points</i>: it is also possible to define a custom pattern
              acquiring points with the robot
            </li>
          </ul>
        </li>
        <br />
        <li>
          <b>Packaging</b>: in this step you can define the packaging operations
          to fill the empty capsules. You can define the operculator <b>Grid</b>{' '}
          with its details:
          <ul>
            <li>
              <i>Name</i>: the name of the grid
            </li>
            <li>
              <i>Shared</i>: if the grid is shared with other users
            </li>
            <li>
              <i>Keywords</i>: keywords used as synonyms for refer the grid
            </li>
            <li>
              <i>Rows</i>: the number of rows of the grid
            </li>
            <li>
              <i>Columns</i>: the number of columns of the grid
            </li>
            <li>
              <i>Height</i>: the height acquired from the robot at which to
              perform the packaging action
            </li>
            <li>
              <i>Photo</i>: it is also possible to acquire a photo of the grid
              to recognize automatically the number of rows and columns and the
              shape of the grid
            </li>
          </ul>
        </li>
        <br />
        <li>
          <b>Storaging</b>: in this step you can define the storaging operations
          to move the capsules from the operculator grid to the final container.
          You can define the <b>Container</b> with its details:
          <ul>
            <li>
              <i>Name</i>: the name of the container
            </li>
            <li>
              <i>Shared</i>: if the container is shared with other users
            </li>
            <li>
              <i>Keywords</i>: keywords used as synonyms for refer the container
            </li>
            <li>
              <i>Position</i>: the position acquired from the robot at which to
              perform the placement action. If you acquire also a photo, only
              the height of the acquired position will be used
            </li>
            <li>
              <i>Photo</i>: it is also possible to acquire a photo of the
              container to recognize automatically the shape of the container
            </li>
          </ul>
        </li>
      </ul>
      <h2>My robots</h2>
      <p>
        In this section you can define your robots by selecting an already added
        robot at system level by the Managers. You can define the select the
        robot using a list or a QR code. To acquire the QR code you can use your
        camera or upload a photo of the QR code.
      </p>
    </MainCard>
  )
}

export default Faq
