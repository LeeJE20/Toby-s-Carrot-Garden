import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

import { getAllQuiz } from "../../apis/quizApi";

import { useDispatch } from "react-redux";
import { setHospitalQuizClear } from "../../store/slices/hospitalSlice";
import { setPoliceQuizClear } from "../../store/slices/policeSlice";
import SuccessToby from "../modals/SuccessToby";
import FailToby from "../modals/FailToby";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const EmergencyContainer = styled.div`
  position: relative; 
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-areas:
    "title title title"
    ". conteent button";
  grid-template-rows: 3fr 8fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  height: 100%;
`;

const EmergencyTitle = styled.div`
  grid-area: title;
  font-size: 2.2vw;
  text-align: center;
  align-self: last baseline;
  margin-bottom: 2%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EmergencyContent = styled.div`
  grid-area: conteent;
  display: grid;

  justify-items: center;
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
`;

const SubmitArea = styled.div`
  grid-area: button;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const RetryBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  font-size: 1.5vw;
  width: 10vw;
  height: 5vw;
  background-image: url("/Image/button/againBtn.png");
  background-size: 100% 100%;
  cursor: url("/Image/cursor/hover.png"), pointer;
  &:hover{
    transform: translateY(3px);
  }
`;

const SubmitBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  font-size: 1.5vw;
  width: 10vw;
  height: 5vw;
  background-image: url("/Image/button/callBtn.png");
  background-size: 100% 100%;
  cursor: url("/Image/cursor/hover.png"), pointer;

  &:hover{
    transform: translateY(3px);
  }
`;

const NumberBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  font-size: 1.5vw;
  width: 10vw;
  height: 5vw;
  background-image: url("/Image/button/numberBtn.png");
  background-size: 100% 100%;
`;

const PhoneBackground = styled.img`
position: absolute;
  height: 100%;
  width: auto;
  object-fit: contain;
`;

const PhoneNumber = styled.div`
  position: absolute;
  display: flex;
  top: 18%;
  justify-content: center;
  font-size: 3.5rem;
`;

const PhoneButtonContainer = styled.div`
  display: grid;
  position: absolute;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  justify-content: center;
  align-items: center;
  bottom: 5%;
  font-size: 3.5rem;
`;

const PhoneButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5vw;
  margin: 0 1vw 0 1vw;
  cursor: pointer;
`;

const ErrorModal = styled.div`
  border: 1px solid black;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  left: 50.5%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 200px;
  font-size: 1.5vw;
  background-color: #ffeded;
  z-index: 10;
  box-shadow: 8px 16px 16px hsl(0deg 0% 0% / 0.4);
  border-radius: 15px;
`;

const ModalCloseBtn = styled.div`
  position: absolute;
  bottom: 20px;
  padding: 3%;
  font-size: 1vw;
  border-radius: 8px;
  cursor: url("/Image/cursor/hover.png"), pointer;
  
  &:hover{
    background-color: rgba(0,0,0,0.1);
  }
`;

const AudioPlayer = styled.audio`
  position: absolute;
`;

const AudioBtnNS = styled.button`
  z-index: 1000;
  width: 3vw;
  height: 3vw;
  background-image: url("/Image/button/no-sound.png");
  background-size: 100% 100%;
  background-color: transparent;
  border: none;
  &:focus,
  &:hover {
    outline: none;
    background-color: transparent;
  }
`;

const AudioBtnS = styled.button`
  z-index: 1000;
  width: 3vw;
  height: 3vw;
  background-image: url("/Image/button/sound.png");
  background-size: 100% 100%;
  background-color: transparent;
  border: none;
  &:focus,
  &:hover {
    outline: none;
    background-color: transparent;
  }
`;

const AudioArea = styled.div`
  position: absolute;
  top: calc(1%);
  margin: calc(2%);
`;

interface Scene {
  sceneId: number;
  quizType: string;
  sceneImageUrl: string;
  content: string;
  voice: string;
}

const StoryEmergency = ({ index, place }) => {
  const [numList] = useState(() => {
    const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"];
    return list;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isCarrotModalOpen, setIsCarrotModalOpen] = useState(false);
  const [IsFailModalOpen, setIsFailModalOpen] = useState(false);
  const [IsSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const sceneList = useSelector<RootState, Scene[]>((state: RootState) => {
    if (place === "hospital") {
      return state.hospital.sceneList;
    } else if (place === "school") {
      return state.school.sceneList;
    } else if (place === "mart") {
      return state.mart.sceneList;
    } else if (place === "police") {
      return state.police.sceneList;
    } else {
      return [];
    }
  });
  const place_id = useSelector<RootState, number>(
    (state: RootState) => state.place.placeId
  );
  console.log(place_id);

  const [number, setNumber] = useState("");

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const dispatch = useDispatch();

  const handleTogglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      console.log("audioRef is null");
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleBtnClick = (e) => {
    const newNumber = number + e;
    if (newNumber.length > 3) {
      setIsModalOpen(true);
    } else {
      setNumber(newNumber);
    }
  };
  const submit = async () => {
    console.log("입력된 번호:", number);
    try {
      if (place === "hospital" && number === "119") {
        setIsSuccessModalOpen(true);
        const response = await getAllQuiz({ place_id });
        console.log(response);
        console.log(place);
        console.log("1");
        setTimeout(() => {
          setIsSuccessModalOpen(false);
        }, 2000);
        dispatch(setHospitalQuizClear(true));
      }
      // police에서 112를 정확히 입력했을 경우
      else if (place === "police" && number === "112") {
        setIsSuccessModalOpen(true);
        const response = await getAllQuiz({ place_id });
        console.log(response);
        console.log(place);
        setTimeout(() => {
          setIsSuccessModalOpen(false);
        }, 2000);
        dispatch(setPoliceQuizClear(true));
      }
      // 위의 경우를 제외한 모든 경우(실패)에 FailToby 모달을 표시
      else {
        setIsFailModalOpen(true);
        console.log("1");
        setTimeout(() => {
          setIsFailModalOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Container>
<EmergencyContainer>
      <AudioArea>
        <AudioPlayer
          ref={audioRef}
          controls
          autoPlay
          preload="metadata"
          hidden
          onEnded={handleAudioEnded}
        >
          <source src={sceneList[index].voice} type="audio/mpeg" />
        </AudioPlayer>
        {isPlaying ? (
          <AudioBtnS onClick={handleTogglePlay}></AudioBtnS>
        ) : (
          <AudioBtnNS onClick={handleTogglePlay}></AudioBtnNS>
        )}
      </AudioArea>
      <EmergencyTitle>어디로 전화해야할까요? <br/> 번호를 눌러주세요</EmergencyTitle>

      <EmergencyContent>
          <PhoneBackground src="/Image/modal/phone.png" alt="phone" />
          <PhoneNumber>{number}</PhoneNumber>
          {isModalOpen && (
            <ErrorModal>
              <div>정답은 세글자 입니다</div>
              <ModalCloseBtn
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                닫기
              </ModalCloseBtn>
            </ErrorModal>
          )}
          {IsSuccessModalOpen && (
            <>
              <SuccessToby onClose={() => setIsSuccessModalOpen(false)} />
              <audio ref={audioRef} controls autoPlay hidden>
                <source src="/Sound/당근획득.mp3" type="audio/mpeg" />
              </audio>
            </>
          )}
          {IsFailModalOpen && (
            <>
              <FailToby onClose={() => setIsFailModalOpen(false)} />
              <audio ref={audioRef} controls autoPlay hidden>
                <source src="/Sound/다시도전.mp3" type="audio/mpeg" />
              </audio>
            </>
          )}
          <PhoneButtonContainer>
            {numList.map((num) => {
              return (
                <PhoneButton
                  key={num}
                  onClick={() => {
                    handleBtnClick(num);
                  }}
                >
                  {num}
                </PhoneButton>
              );
            })}
          </PhoneButtonContainer>
      </EmergencyContent>
      <SubmitArea>
        <RetryBtn
          onClick={() => {
            setNumber("");
          }}
        >
        </RetryBtn>
        {number.length > 2 ? (
          <SubmitBtn onClick={() => { submit(); }} />
        ) : (
          <NumberBtn/>
        )}
      </SubmitArea>

    </EmergencyContainer>

    </Container>
  );
};

export default StoryEmergency;
