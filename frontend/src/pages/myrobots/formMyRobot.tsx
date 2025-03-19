import React from 'react'
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import {
  string as YupString,
  object as YupObject,
  number as YupNumber,
} from 'yup'
import { FileImageOutlined, QrcodeOutlined } from '@ant-design/icons'

import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { MessageText, MessageTextMaxLength } from 'utils/messages'
import { RobotType } from 'pages/robots/types'
import { MyRobotDetailType } from './types'

interface FormMyRobotProps {
  dataMyRobot: MyRobotDetailType | undefined
  dataRobots: RobotType[]
  insertMode: boolean
  backFunction: () => void
}

export const FormMyRobot = ({
  dataMyRobot,
  dataRobots,
  insertMode,
  backFunction,
}: FormMyRobotProps) => {
  const onSubmit = async (
    values: MyRobotDetailType,
    { setStatus, setSubmitting, setFieldError, setFieldTouched },
  ) => {
    const method = insertMode ? MethodHTTP.POST : MethodHTTP.PUT
    fetchApi({ url: endpoints.home.libraries.myRobot, method, body: values })
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

  return (
    <Formik
      initialValues={{
        id: dataMyRobot?.id || -1,
        name: dataMyRobot?.name || '',
        robot: dataMyRobot?.robot || null,
      }}
      validationSchema={YupObject().shape({
        name: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        robot: YupNumber().required(MessageText.requiredField),
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
      }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault()
          }}
        >
          <Grid container spacing={3} columns={{ xs: 1, sm: 6, md: 12 }}>
            <Grid item xs={8}>
              <Stack spacing={1}>
                <TextField
                  id="name"
                  value={values.name || ''}
                  name="name"
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.name && errors.name)}
                  title="Name of your personal robot"
                />
                {touched.name && errors.name && (
                  <FormHelperText error id="helper-text-name">
                    {errors.name}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack spacing={1}>
                <FormControl fullWidth>
                  <InputLabel id="robot-label">Robot</InputLabel>
                  <Select
                    labelId="robot-label"
                    id="robot"
                    value={values.robot || ''}
                    label="Robot"
                    name="robot"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.robot && errors.robot)}
                    title="Select the robot at system level that will be used as your personal robot"
                  >
                    {dataRobots?.map((robot) => (
                      <MenuItem value={robot.id} key={robot.id}>
                        {robot.name}
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
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Button
                  color="primary"
                  aria-label="detail"
                  size="medium"
                  title="Acquire robot ID from webcam"
                  startIcon={<QrcodeOutlined style={{ fontSize: '2em' }} />}
                >
                  Acquire from webcam
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Button
                  color="primary"
                  aria-label="detail"
                  size="medium"
                  title="Acquire robot ID from image file"
                  startIcon={<FileImageOutlined style={{ fontSize: '2em' }} />}
                >
                  Upload image
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Button
                disableElevation
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                title="Save this personal robot"
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
