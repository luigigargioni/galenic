import React from 'react'
import { Collapse } from 'antd'
import { Divider, useTheme } from '@mui/material'

import { iconMap } from 'utils/iconMap'
import { listPatterns } from 'pages/graphic/FlowApproach/customNodes/mixing/actionPatternNode'
import { listTools } from 'pages/graphic/FlowApproach/customNodes/mixing/actionToolNode'
import { MainCard } from 'components/MainCard'
import { backgroundForm } from 'themes/theme'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { PreparationChatStructure } from './utils'

interface RightPanelProps {
  preparationStructure: PreparationChatStructure
}

export const RightPanel = ({ preparationStructure }: RightPanelProps) => {
  const theme = useTheme()

  const mixingDefined =
    preparationStructure.mixing.actionNameAlreadyDefined ||
    (preparationStructure.mixing.actionNameNew &&
      preparationStructure.mixing.tool &&
      preparationStructure.mixing.pattern &&
      preparationStructure.mixing.time &&
      preparationStructure.mixing.speed)
  const packagingDefined =
    preparationStructure.packaging.gridNameAlreadyDefined ||
    (preparationStructure.packaging.gridNameNew &&
      preparationStructure.packaging.rows &&
      preparationStructure.packaging.columns &&
      (preparationStructure.packaging.acquireGridPhoto ||
        preparationStructure.packaging.acquireGridPosition))
  const storagingDefined =
    preparationStructure.storaging.containerNameAlreadyDefined ||
    (preparationStructure.storaging.containerNameNew &&
      (preparationStructure.storaging.acquireContainerPhoto ||
        preparationStructure.storaging.acquireContainerPosition))

  const selectedToolName =
    listTools.find((tool) => tool.id === preparationStructure.mixing.tool)
      ?.name || null
  const selectedPatternName =
    listPatterns.find(
      (pattern) => pattern.id === preparationStructure.mixing.pattern,
    )?.name || null
  const selectedSpeedName = () => {
    switch (preparationStructure.mixing.speed) {
      case 1:
        return 'Low'
      case 2:
        return 'Medium'
      case 3:
        return 'High'
      default:
        return null
    }
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
      <MainCard
        sx={{
          background: backgroundForm,
          marginRight: '1rem',
        }}
      >
        <h2>
          {mixingDefined && packagingDefined && storagingDefined
            ? iconMap.successDataSmall
            : iconMap.partialDataSmall}
          {'  '}
          Preparation in progress
        </h2>
        <h4>
          {mixingDefined ? iconMap.successDataSmall : iconMap.partialDataSmall}
          {'  '}
          Mixing
        </h4>

        {preparationStructure.mixing.actionNameAlreadyDefined && (
          <>
            <Divider textAlign="left">Existing Action</Divider>
            <h5>
              &emsp;&emsp;Name:{' '}
              {preparationStructure.mixing.actionNameAlreadyDefined || (
                <i>Not defined</i>
              )}
            </h5>
          </>
        )}
        {preparationStructure.mixing.actionNameNew && (
          <>
            <Divider textAlign="left">New Action</Divider>
            <h5>
              &emsp;&emsp;Name:{' '}
              {preparationStructure.mixing.actionNameNew || <i>Not defined</i>}
            </h5>
            <h5>&emsp;&emsp;Tool: {selectedToolName || <i>Not defined</i>}</h5>
            <h5>
              &emsp;&emsp;Time:{' '}
              {preparationStructure.mixing.time ? (
                `${preparationStructure.mixing.time} seconds`
              ) : (
                <i>Not defined</i>
              )}
            </h5>
            <h5>
              &emsp;&emsp;Pattern: {selectedPatternName || <i>Not defined</i>}
            </h5>
            <h5>
              &emsp;&emsp;Speed: {selectedSpeedName() || <i>Not defined</i>}
            </h5>
          </>
        )}
        <h4>
          {packagingDefined
            ? iconMap.successDataSmall
            : iconMap.partialDataSmall}{' '}
          Packaging
        </h4>
        {preparationStructure.packaging.gridNameAlreadyDefined && (
          <>
            <Divider textAlign="left">Existing Grid</Divider>
            <h5>
              &emsp;&emsp;Name:{' '}
              {preparationStructure.packaging.gridNameAlreadyDefined || (
                <i>Not defined</i>
              )}
            </h5>
          </>
        )}
        {preparationStructure.packaging.gridNameNew && (
          <>
            <Divider textAlign="left">New Grid</Divider>
            <h5>
              &emsp;&emsp;Name:{' '}
              {preparationStructure.packaging.gridNameNew || <i>Not defined</i>}
            </h5>
            <h5>
              &emsp;&emsp;Rows:{' '}
              {preparationStructure.packaging.rows || <i>Not defined</i>}
            </h5>
            <h5>
              &emsp;&emsp;Columns:{' '}
              {preparationStructure.packaging.columns || <i>Not defined</i>}
            </h5>
            {preparationStructure.packaging.acquireGridPhoto && (
              <h5>&emsp;&emsp;Photo: Acquired</h5>
            )}
            {preparationStructure.packaging.acquireGridPosition && (
              <h5>&emsp;&emsp;Position: Acquired</h5>
            )}
          </>
        )}
        <h4>
          {storagingDefined
            ? iconMap.successDataSmall
            : iconMap.partialDataSmall}{' '}
          Storage
        </h4>
        {preparationStructure.storaging.containerNameAlreadyDefined && (
          <>
            <Divider textAlign="left">Existing Container</Divider>
            <h5>
              &emsp;&emsp;Name:{' '}
              {preparationStructure.storaging.containerNameAlreadyDefined || (
                <i>Not defined</i>
              )}
            </h5>
          </>
        )}
        {preparationStructure.storaging.containerNameNew && (
          <>
            <Divider textAlign="left">New Container</Divider>
            <h5>
              &emsp;&emsp;Name:{' '}
              {preparationStructure.storaging.containerNameNew || (
                <i>Not defined</i>
              )}
            </h5>
            {preparationStructure.storaging.acquireContainerPhoto && (
              <h5>&emsp;&emsp;Photo: Acquired</h5>
            )}
            {preparationStructure.storaging.acquireContainerPosition && (
              <h5>&emsp;&emsp;Position: Acquired</h5>
            )}
          </>
        )}
      </MainCard>
      <h2 style={{ marginTop: '1rem' }}>
        <QuestionCircleOutlined /> Instructions & FAQ
      </h2>
      <p>In this chat you can define a new galenic preparation.</p>
      <p>The steps to be defined are:</p>
      <ol>
        <li>
          <b>Mixing</b>: use an already existing <b>action</b> or define a new
          one.
          <ul>
            <li>
              <i>Action details</i>: name, tool, time and pattern.
            </li>
          </ul>
        </li>
        <li>
          <b>Packaging</b>: use an already existing <b>grid</b> or define a new
          one.
          <ul>
            <li>
              <i>Grid details</i>: name, rows, columns and position/photo.
            </li>
          </ul>
        </li>
        <li>
          <b>Storage</b>: use an already existing <b>container</b> or define a
          new one.
          <ul>
            <li>
              <i>Container details</i>: name and position/photo.
            </li>
          </ul>
        </li>
      </ol>
      <p>Other useful information:</p>
      <ul>
        <li>Ask if you don&apos;t know how to proceed</li>
        <li>Preparation will not be saved until the end of the conversation</li>
      </ul>
      <Divider />
      <Divider style={{ marginTop: '1rem' }} />
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
