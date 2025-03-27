import React from 'react'
import {
  Button,
  CardMedia,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { string as YupString, object as YupObject } from 'yup'
import { AimOutlined, PlusOutlined } from '@ant-design/icons'

import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { MessageText, MessageTextMaxLength } from 'utils/messages'
import { MyRobotType } from 'pages/myrobots/types'
import { useSearchParams } from 'react-router-dom'
import { ContainerDetailType } from './types'

interface FormContainerProps {
  dataContainer: ContainerDetailType | undefined
  dataMyRobots: MyRobotType[]
  insertMode: boolean
  backFunction: () => void
}

export const FormContainer = ({
  dataContainer,
  dataMyRobots,
  insertMode,
  backFunction,
}: FormContainerProps) => {
  const [searchParams] = useSearchParams()
  const forcedName = searchParams.get('forcedName')
  const [acquiredPhoto, setAcquiredPhoto] = React.useState<boolean>(false)
  const [addKeyword, setAddKeyword] = React.useState<string>('')
  const [keywordErrors, setKeywordErrors] = React.useState<string[]>([])

  const onSubmit = async (
    values: ContainerDetailType,
    { setStatus, setSubmitting, setFieldError, setFieldTouched },
  ) => {
    const method = insertMode ? MethodHTTP.POST : MethodHTTP.PUT
    fetchApi({ url: endpoints.home.libraries.container, method, body: values })
      .then(async (res) => {
        if (res && res.nameAlreadyExists) {
          await setFieldTouched('name', true)
          await setFieldError('name', MessageText.alreadyExists)
          setStatus({ success: false })
          return
        }
        setStatus({ success: true })
        toast.success(MessageText.success)
        backFunction()
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handleGetPosition = async (
    robot: number | null,
    setFieldValue: (field: string, value: any) => void,
    setFieldError: (field: string, value: any) => void,
    setFieldTouched: (field: string, touched: any) => void,
  ) => {
    if (!robot) {
      await setFieldTouched('robot', true)
      await setFieldError('robot', MessageText.requiredField)
      return
    }
    toast.success('Position acquired')
    /*     fetchApi({
      url: endpoints.home.libraries.getPosition,
      method: MethodHTTP.POST,
      body: { robot },
    }).then((response) => {
      if (response) {
        setFieldValue('position', JSON.stringify(response.position))
      }
    }) */
  }

  const handleGetPhoto = async (
    robot: number | null,
    setFieldValue: (field: string, value: any) => void,
    setFieldError: (field: string, value: any) => void,
    setFieldTouched: (
      field: string,
      isTouched: boolean,
      shouldValidate: boolean,
    ) => void,
  ) => {
    if (!robot) {
      await setFieldTouched('robot', true, true)
      await setFieldError('robot', MessageText.requiredField)
      return
    }
    setAcquiredPhoto(true)
    setFieldValue('photo', '/test_image/container_photo.png')
    setFieldValue('contour', '/test_image/container_contour.png')
    setFieldValue('shape', '/test_image/container_shape.png')

    /*     fetchApi({
      url: endpoints.home.libraries.getPhoto,
      method: MethodHTTP.POST,
      body: { robot },
    }).then((response) => {
      if (response) {
        setFieldValue('photo', response.photo)
        setFieldValue('contour', response.contour)
        setFieldValue('shape', response.shape)
      }
    }) */
  }

  return (
    <Formik
      initialValues={{
        id: dataContainer?.id || -1,
        name: forcedName || dataContainer?.name || '',
        shared: dataContainer?.shared || false,
        position: dataContainer?.position || null,
        photo: dataContainer?.photo || '',
        contour: dataContainer?.contour || '',
        shape: dataContainer?.shape || '',
        keywords: dataContainer?.keywords || [],
        robot: null,
      }}
      validationSchema={YupObject().shape({
        name: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
      })}
      onSubmit={onSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        setFieldValue,
        setFieldError,
        setFieldTouched,
      }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault()
          }}
        >
          <Grid container spacing={3} columns={{ xs: 1, sm: 6, md: 12 }}>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="name"
                  value={values.name || ''}
                  name="name"
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!!forcedName}
                  error={Boolean(touched.name && errors.name)}
                  title="Name of the container"
                />
                {touched.name && errors.name && (
                  <FormHelperText error id="helper-text-name">
                    {errors.name}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={1}>
              <Stack spacing={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="shared"
                      value={values.shared}
                      name="shared"
                      onBlur={handleBlur}
                      onChange={() => setFieldValue('shared', !values.shared)}
                      checked={values.shared}
                    />
                  }
                  label="Shared"
                  title="Share this container with other users"
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider textAlign="left">Keywords</Divider>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="add_keyword"
                  value={addKeyword}
                  name="add_keyword"
                  label="Add keyword"
                  title="You can define keywords for this grid to be used as synonyms during the chat"
                  onChange={(e) => setAddKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (addKeyword) {
                        const newKeywords = [...values.keywords]
                        newKeywords.push(addKeyword)
                        setFieldValue('keywords', newKeywords)
                        setAddKeyword('')
                      }
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            if (addKeyword) {
                              const newKeywords = [...values.keywords]
                              newKeywords.push(addKeyword)
                              setFieldValue('keywords', newKeywords)
                              setAddKeyword('')
                            }
                          }}
                          disabled={
                            !addKeyword || values.keywords.includes(addKeyword)
                          }
                          edge="end"
                        >
                          <PlusOutlined />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack spacing={1} direction="row">
                {values.keywords.map((keyword, index) => (
                  <Chip
                    key={keyword}
                    label={keyword}
                    variant="outlined"
                    onDelete={() => {
                      const newKeywords = [...values.keywords]
                      newKeywords.splice(index, 1)
                      setFieldValue('keywords', newKeywords)

                      const newKeywordErrors = keywordErrors.filter(
                        (keywordError) => keywordError !== keyword,
                      )
                      setKeywordErrors(newKeywordErrors)
                    }}
                    color={
                      keywordErrors.includes(keyword) ? 'error' : 'primary'
                    }
                  />
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider textAlign="left">Position</Divider>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <FormControl fullWidth>
                  <InputLabel id="robot-id-label">Robot</InputLabel>
                  <Select
                    labelId="robot-id-label"
                    id="robot"
                    value={values.robot || ''}
                    label="Robot"
                    name="robot"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      setFieldValue('robot', e.target.value)
                      setFieldValue('position', '')
                    }}
                    error={Boolean(touched.robot && errors.robot)}
                    title="Robot use to acquire position and photo"
                  >
                    {dataMyRobots?.map((myRobot) => (
                      <MenuItem value={myRobot.id} key={myRobot.id}>
                        {myRobot.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.robot && errors.robot && (
                    <FormHelperText error id="helper-text-robot">
                      {errors.robot}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <Button
                  onClick={() =>
                    handleGetPosition(
                      values.robot,
                      setFieldValue,
                      setFieldError,
                      setFieldTouched,
                    )
                  }
                  color="primary"
                  aria-label="detail"
                  size="medium"
                  variant="outlined"
                  title="Acquire the position of the container"
                  startIcon={<AimOutlined style={{ fontSize: '2em' }} />}
                >
                  Get position
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider textAlign="left">Images</Divider>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Button
                  onClick={() =>
                    handleGetPhoto(
                      values.robot,
                      setFieldValue,
                      setFieldError,
                      setFieldTouched,
                    )
                  }
                  color="primary"
                  aria-label="detail"
                  size="medium"
                  variant="outlined"
                  title="Acquire the photo of the container"
                  startIcon={<AimOutlined style={{ fontSize: '2em' }} />}
                >
                  Get photo
                </Button>
              </Stack>
            </Grid>
            {values.photo && (
              <Grid
                item
                xs={4}
                container
                direction="column"
                alignItems="center"
              >
                <Stack spacing={1}>
                  <CardMedia
                    component="img"
                    title="Original photo acquired"
                    sx={{
                      maxWidth: '500px',
                      maxHeight: '500px',
                      border: '1px solid',
                    }}
                    image={
                      acquiredPhoto
                        ? values.photo
                        : `data:image/png;base64,${values.photo}`
                    }
                    alt="Container Photo"
                  />
                </Stack>
              </Grid>
            )}
            {values.contour && (
              <Grid
                item
                xs={4}
                container
                direction="column"
                alignItems="center"
              >
                <Stack spacing={1}>
                  <CardMedia
                    component="img"
                    title="Photo elaborated to find contour"
                    sx={{
                      maxWidth: '500px',
                      maxHeight: '500px',
                      border: '1px solid',
                    }}
                    image={
                      acquiredPhoto
                        ? values.contour
                        : `data:image/png;base64,${values.contour}`
                    }
                    alt="Container Contour"
                  />
                </Stack>
              </Grid>
            )}
            {values.shape && (
              <Grid
                item
                xs={4}
                container
                direction="column"
                alignItems="center"
              >
                <Stack spacing={1}>
                  <CardMedia
                    component="img"
                    title="Photo elaborated to recognize the shape"
                    sx={{
                      maxWidth: '500px',
                      maxHeight: '500px',
                      border: '1px solid',
                    }}
                    image={
                      acquiredPhoto
                        ? values.shape
                        : `data:image/png;base64,${values.shape}`
                    }
                    alt="Container Shape"
                  />
                </Stack>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                disableElevation
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                title="Save this container"
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  )
}
