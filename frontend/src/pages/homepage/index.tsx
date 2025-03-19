import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material'
import { MainCard } from 'components/MainCard'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { activeItem } from 'store/reducers/menu'

const Homepage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  React.useEffect(() => {
    dispatch(activeItem('homepage'))
  }, [])

  return (
    <MainCard
      title="Let's define a new galenic preparation: how do you want to proceed?"
      subtitle="Click on the cards below to start."
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <Card>
          <CardActionArea
            onClick={() => {
              navigate('/preparation/add?type=chat')
              dispatch(activeItem('definechat'))
            }}
            title="Create a new preparation by chat"
          >
            <CardMedia
              component="img"
              image="/pages/chat_example.png"
              height={300}
              alt="chat"
            />
            <CardContent>
              <Typography gutterBottom variant="h3" component="div">
                Chat
              </Typography>
              <Typography variant="h5" color="text.secondary">
                Create a new preparation by chatting
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card>
          <CardActionArea
            onClick={() => {
              navigate('/preparation/add?type=graphic')
              dispatch(activeItem('definegraphic'))
            }}
            title="Create a new preparation by graphic interface"
          >
            <CardMedia
              component="img"
              image="/pages/graphic_example.png"
              height={300}
              alt="graphic"
            />
            <CardContent>
              <Typography gutterBottom variant="h3" component="div">
                Graphic
              </Typography>
              <Typography variant="h5" color="text.secondary">
                Create a new preparation by the graphic interface
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    </MainCard>
  )
}

export default Homepage
