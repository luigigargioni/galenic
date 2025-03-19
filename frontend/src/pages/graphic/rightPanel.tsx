import React from 'react'
import { Collapse, Divider } from 'antd'
import { Button, useTheme } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store/reducers'
import { MethodHTTP, fetchApi } from 'services/api'
import { endpoints } from 'services/endpoints'
import { toast } from 'react-toastify'
import { MessageText } from 'utils/messages'
import { useParams } from 'react-router-dom'
import {
  EditOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import {
  initialState,
  updateEditMode,
  updatePreparation,
} from 'store/reducers/preparation'

import { PreparationGraphicStructure } from './type'

interface RightPanelProps {
  backFunction: () => void
}

export const RightPanel = ({ backFunction }: RightPanelProps) => {
  const preparationStructure: PreparationGraphicStructure = useSelector(
    (state: RootState) => state.preparation,
  )
  const { id } = useParams()
  const theme = useTheme()
  const dispatch = useDispatch()

  const handleSave = () => {
    fetchApi({
      url: endpoints.graphic.saveGraphicPreparation,
      method: MethodHTTP.PUT,
      body: { preparationStructure, id },
    }).then(() => {
      toast.success(MessageText.success)
      backFunction()
    })
  }

  const handleCancel = () => {
    fetchApi({
      url: endpoints.graphic.getGraphicPreparation,
      method: MethodHTTP.GET,
      body: { id },
    }).then((res) => {
      const dataPreparationCode = JSON.parse(res.code) || initialState

      const completePreparationCode: PreparationGraphicStructure = {
        ...dataPreparationCode,
        mixing: {
          ...dataPreparationCode.mixing,
          speed: dataPreparationCode.mixing.speed || 1,
          hideDetails: !dataPreparationCode.mixing.actionId,
        },
        packaging: {
          ...dataPreparationCode.packaging,
          hideDetails: !dataPreparationCode.packaging.gridId,
        },
        editMode: false,
      }

      dispatch(updatePreparation(completePreparationCode))
      dispatch(updateEditMode({ value: false }))
    })
  }

  return (
    <div
      style={{
        borderLeft: `1px solid ${theme.palette.grey[300]}`,
        paddingLeft: '1rem',
        width: '33.33%',
        overflow: 'auto',
      }}
    >
      {!preparationStructure.editMode && (
        <Button
          fullWidth
          variant="contained"
          startIcon={<EditOutlined />}
          onClick={() => dispatch(updateEditMode({ value: true }))}
          color="warning"
        >
          Edit
        </Button>
      )}
      {preparationStructure.editMode && (
        <>
          <Button
            fullWidth
            variant="contained"
            startIcon={<SaveOutlined />}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            fullWidth
            onClick={handleCancel}
            style={{ marginTop: '1rem' }}
          >
            Cancel
          </Button>
        </>
      )}
      <Divider />
      <h2>
        <QuestionCircleOutlined /> Instructions & FAQ
      </h2>
      <p>In this graphic interface you can edit a galenic preparation.</p>
      <ul>
        <li>
          If a library is not available, you can create a new one by writing the
          name and clicking on the button &quot;Add&quot;.
        </li>
        <li>
          The library details can be edited without affecting the original
          library.
        </li>
      </ul>
      <Divider />
      <Collapse
        key="preparation-collapse-debug"
        style={{ marginTop: '1rem', marginRight: '1rem' }}
        items={[
          {
            label: 'Preparation JSON',
            key: 'preparation-json',
            children: (
              <pre>{JSON.stringify(preparationStructure, null, 2)}</pre>
            ),
          },
        ]}
      />
    </div>
  )
}
