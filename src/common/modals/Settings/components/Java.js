import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJava } from '@fortawesome/free-brands-svg-icons';
import {
  faMemory,
  faFolder,
  faUndo,
  faLevelDownAlt,
  faList,
  faDesktop,
  faPlay
} from '@fortawesome/free-solid-svg-icons';
import { Slider, Button, Input, Switch, Select } from 'antd';
import {
  updateJava16Path,
  updateJavaArguments,
  updateJavaMemory,
  updateJavaPath,
  updateMcStartupMethod,
  updateResolution
} from '../../../reducers/settings/actions';
import {
  DEFAULT_JAVA_ARGS,
  resolutionPresets
} from '../../../../app/desktop/utils/constants';
import { _getJavaPath } from '../../../utils/selectors';
import { openModal } from '../../../reducers/modals/actions';
import { MC_STARTUP_METHODS } from '../../../utils/constants';

const AutodetectPath = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  margin-bottom: 30px;
`;

const SelectMemory = styled.div`
  width: 100%;
  height: 100px;
`;

const Resolution = styled.div`
  width: 100%;
  height: 100px;
`;

const McStartupMethod = styled.div`
  width: 100%;
  height: 100px;
`;

const McStartupMethodRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  margin-bottom: 30px;
`;

const ResolutionInputContainer = styled.div`
  margin-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  div {
    width: 200px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`;

const JavaCustomArguments = styled.div`
  width: 100%;
  height: 120px;
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.theme.palette.text.secondary};
`;

const Paragraph = styled.p`
  max-width: 510px;
  color: ${props => props.theme.palette.text.third};
`;

const Hr = styled.div`
  height: 35px;
`;

const MainTitle = styled.h1`
  color: ${props => props.theme.palette.text.primary};
  width: 80px;
  margin: 30px 0 20px 0;
`;

const StyledButtons = styled(Button)`
  float: right;
`;

function resetJavaArguments(dispatch) {
  dispatch(updateJavaArguments(DEFAULT_JAVA_ARGS));
}

const marks = {
  2048: '2048 MB',
  4096: '4096 MB',
  8192: '8192 MB',
  16384: '16384 MB',
  24576: '24576 MB'
};

export default function MyAccountPreferences() {
  const [screenResolution, setScreenResolution] = useState(null);
  const javaArgs = useSelector(state => state.settings.java.args);
  const javaMemory = useSelector(state => state.settings.java.memory);
  const javaPath = useSelector(state => _getJavaPath(state)(8));
  const java16Path = useSelector(state => _getJavaPath(state)(16));
  const customJavaPath = useSelector(state => state.settings.java.path);
  const customJava16Path = useSelector(state => state.settings.java.path16);
  const mcStartupMethod = useSelector(state => state.settings.mcStartupMethod);
  const mcResolution = useSelector(
    state => state.settings.minecraftSettings.resolution
  );
  const dispatch = useDispatch();

  useEffect(() => {
    ipcRenderer
      .invoke('getAllDisplaysBounds')
      .then(setScreenResolution)
      .catch(console.error);
  }, []);

  return (
    <>
      <MainTitle>Java</MainTitle>
      <Title
        css={`
          width: 500px;
          text-align: left;
        `}
      >
        Autodetect Java Path&nbsp; <FontAwesomeIcon icon={faJava} />
        <a
          css={`
            margin-left: 30px;
          `}
          onClick={() => {
            dispatch(openModal('JavaSetup'));
          }}
        >
          再度Javaをセットアップ
        </a>
      </Title>
      <AutodetectPath>
        <Paragraph
          css={`
            text-align: left;
          `}
        >
          これを無効にした場合、自分でjava.exe(64bit)を選択する必要があります。
          自動でJavaをセットアップした場合AdoptOpenJDK-HotSpotを使用します。
        </Paragraph>
        <Switch
          color="primary"
          onChange={c => {
            if (c) {
              dispatch(updateJavaPath(null));
              dispatch(updateJava16Path(null));
            } else {
              dispatch(updateJavaPath(javaPath));
              dispatch(updateJava16Path(java16Path));
            }
          }}
          checked={!customJavaPath && !customJava16Path}
        />
      </AutodetectPath>
      {customJavaPath && customJava16Path && (
        <>
          <div
            css={`
              height: 50px;
              margin: 30px 0;
            `}
          >
            <h3
              css={`
                text-align: left;
              `}
            >
              Java 8
            </h3>
            <div
              css={`
                width: 100%;
              `}
            >
              <FontAwesomeIcon
                icon={faLevelDownAlt}
                flip="horizontal"
                transform={{ rotate: 90 }}
              />
              <Input
                css={`
                  width: 75% !important;
                  margin: 0 10px !important;
                `}
                onChange={e =>
                  dispatch(
                    updateJavaPath(
                      e.target.value === '' ? null : e.target.value
                    )
                  )
                }
                value={customJavaPath}
              />
              <StyledButtons
                color="primary"
                onClick={async () => {
                  const { filePaths, canceled } = await ipcRenderer.invoke(
                    'openFileDialog',
                    javaPath
                  );
                  if (!filePaths[0] || canceled) return;
                  dispatch(updateJavaPath(filePaths[0]));
                }}
              >
                <FontAwesomeIcon icon={faFolder} />
              </StyledButtons>
            </div>
          </div>
          <div
            css={`
              height: 50px;
              margin: 30px 0;
            `}
          >
            <h3
              css={`
                text-align: left;
              `}
            >
              Java 16
            </h3>
            <div
              css={`
                width: 100%;
              `}
            >
              <FontAwesomeIcon
                icon={faLevelDownAlt}
                flip="horizontal"
                transform={{ rotate: 90 }}
              />
              <Input
                css={`
                  width: 75% !important;
                  margin: 0 10px !important;
                `}
                onChange={e => {
                  dispatch(
                    updateJava16Path(
                      e.target.value === '' ? null : e.target.value
                    )
                  );
                }}
                value={customJava16Path}
              />
              <StyledButtons
                color="primary"
                onClick={async () => {
                  const { filePaths, canceled } = await ipcRenderer.invoke(
                    'openFileDialog',
                    javaPath
                  );
                  if (!filePaths[0] || canceled) return;
                  dispatch(updateJava16Path(filePaths[0]));
                }}
              >
                <FontAwesomeIcon icon={faFolder} />
              </StyledButtons>
            </div>
          </div>
        </>
      )}
      <Hr />
      <Resolution>
        <Title
          css={`
            width: 100%;
            margin-top: 0px;
            height: 8px;
            text-align: left;
            margin-bottom: 20px;
          `}
        >
          Game Resolution&nbsp; <FontAwesomeIcon icon={faDesktop} />
        </Title>
        <Paragraph
          css={`
            width: 100%;
            text-align: left;
            margin: 0;
          `}
        >
          マイクラ起動時のウィンドウサイズを指定します 「width：横 x
          height：縦」
        </Paragraph>
        <ResolutionInputContainer>
          <div>
            <Input
              placeholder="width"
              value={mcResolution.width}
              onChange={e => {
                const w = parseInt(e.target.value, 10);
                dispatch(updateResolution({ width: w || 854 }));
              }}
            />
            &nbsp;X&nbsp;
            <Input
              placeholder="Height"
              value={mcResolution.height}
              onChange={e => {
                const h = parseInt(e.target.value, 10);
                dispatch(updateResolution({ height: h || 480 }));
              }}
            />
          </div>
          <Select
            placeholder="プリセット"
            onChange={v => {
              const w = parseInt(v.split('x')[0], 10);
              const h = parseInt(v.split('x')[1], 10);
              dispatch(updateResolution({ height: h, width: w }));
            }}
            virtual={false}
          >
            {resolutionPresets.map(v => {
              const w = parseInt(v.split('x')[0], 10);
              const h = parseInt(v.split('x')[1], 10);

              const isBiggerThanScreen = (screenResolution || []).every(
                bounds => {
                  return bounds.width < w || bounds.height < h;
                }
              );
              if (isBiggerThanScreen) return null;
              return (
                <Select.Option key={v} value={v}>
                  {v}
                </Select.Option>
              );
            })}
          </Select>
        </ResolutionInputContainer>
      </Resolution>
      <Hr />
      <SelectMemory>
        <Title
          css={`
            width: 100%;
            margin-top: 0px;
            height: 8px;
            text-align: left;
            margin-bottom: 20px;
          `}
        >
          Java Memory&nbsp; <FontAwesomeIcon icon={faMemory} />
        </Title>
        <Paragraph
          css={`
            width: 100%;
            text-align: left;
            margin: 0;
          `}
        >
          マイクラに使用する最大メモリ量を選択します。※パソコンの利用可能なメモリ量を超えて設定するとメモリの限界まで使用されます。
        </Paragraph>
        <Slider
          css={`
            margin: 20px 20px 20px 0;
          `}
          onAfterChange={e => {
            dispatch(updateJavaMemory(e));
          }}
          defaultValue={javaMemory}
          min={1024}
          // max={process.getSystemMemoryInfo().total / 1024}
          max={32768}
          step={512}
          marks={marks}
          valueLabelDisplay="auto"
        />
      </SelectMemory>
      <Hr />
      <JavaCustomArguments>
        <Title
          css={`
            width: 100%;
            text-align: left;
          `}
        >
          Java Custom Arguments &nbsp; <FontAwesomeIcon icon={faList} />
        </Title>
        <Paragraph
          css={`
            text-align: left;
          `}
        >
          マイクラに使用する引数を設定します。※高度な設定
        </Paragraph>
        <div
          css={`
            margin-top: 20px;
            width: 100%;
          `}
        >
          <Input
            onChange={e => dispatch(updateJavaArguments(e.target.value))}
            value={javaArgs}
            css={`
              width: 83% !important;
              height: 32px !important;
              float: left !important;
            `}
          />
          <StyledButtons
            onClick={() => resetJavaArguments(dispatch)}
            color="primary"
          >
            <FontAwesomeIcon icon={faUndo} />
          </StyledButtons>
        </div>
      </JavaCustomArguments>
      <Hr />
      <McStartupMethod>
        <Title
          css={`
            width: 70%;
            text-align: left;
          `}
        >
          Minecraft Startup Method &nbsp; <FontAwesomeIcon icon={faPlay} />
        </Title>
        <McStartupMethodRow>
          <Paragraph
            css={`
              text-align: left;
            `}
          >
            Select the preferred Minecraft startup method. Only change this if
            you&apos;re experiencing issues with the default one.
          </Paragraph>
          <Select
            value={mcStartupMethod}
            onChange={v => dispatch(updateMcStartupMethod(v))}
          >
            {Object.entries(MC_STARTUP_METHODS).map(([k, v]) => {
              return (
                <Select.Option key={k} value={k}>
                  {v}
                </Select.Option>
              );
            })}
          </Select>
        </McStartupMethodRow>
      </McStartupMethod>
    </>
  );
}
