import os
import torch
import torchaudio
import numpy as np
from typing import Dict, Any
from boson_multimodal.serve.serve_engine import HiggsAudioServeEngine, HiggsAudioResponse
from boson_multimodal.data_types import ChatMLSample, Message, AudioContent

# 모델 경로 설정
MODEL_PATH = "bosonai/higgs-audio-v2-generation-3B-base"
AUDIO_TOKENIZER_PATH = "bosonai/higgs-audio-v2-tokenizer"

# 시스템 프롬프트 설정
DEFAULT_SYSTEM_PROMPT = (
    "Generate audio following instruction.\n\n<|scene_desc_start|>\nAudio is recorded from a quiet room.\n<|scene_desc_end|>"
)

# 음성 스타일 프롬프트 매핑
VOICE_STYLES = {
    "따뜻하게": "Speak in a warm, friendly, and welcoming tone. Use gentle and caring voice.",
    "활기차게": "Speak in an energetic, enthusiastic, and lively tone. Use dynamic and engaging voice.",
    "차분하게": "Speak in a calm, peaceful, and soothing tone. Use relaxed and tranquil voice.",
    "전문적으로": "Speak in a professional, confident, and authoritative tone. Use clear and precise voice.",
    "친근하게": "Speak in a casual, approachable, and conversational tone. Use natural and friendly voice."
}

class Predictor:
    def __init__(self):
        """모델 초기화"""
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.serve_engine = None
        self._load_model()
    
    def _load_model(self):
        """Higgs Audio v2 모델 로드"""
        try:
            self.serve_engine = HiggsAudioServeEngine(
                MODEL_PATH, 
                AUDIO_TOKENIZER_PATH, 
                device=self.device
            )
        except Exception as e:
            print(f"모델 로드 중 오류 발생: {e}")
            raise
    
    def predict(self, text: str, voice_style: str = "따뜻하게", temperature: float = 0.3) -> Dict[str, Any]:
        """
        텍스트를 음성으로 변환
        
        Args:
            text: 변환할 텍스트
            voice_style: 음성 스타일 ("따뜻하게", "활기차게", "차분하게", "전문적으로", "친근하게")
            temperature: 생성 온도 (0.1-1.0)
        
        Returns:
            Dict containing audio data and metadata
        """
        try:
            # 음성 스타일 프롬프트 가져오기
            style_prompt = VOICE_STYLES.get(voice_style, VOICE_STYLES["따뜻하게"])
            
            # 시스템 프롬프트에 스타일 추가
            system_prompt = f"{DEFAULT_SYSTEM_PROMPT}\n\n{style_prompt}"
            
            # 메시지 구성
            messages = [
                Message(
                    role="system",
                    content=system_prompt,
                ),
                Message(
                    role="user",
                    content=text,
                ),
            ]
            
            # 음성 생성
            output: HiggsAudioResponse = self.serve_engine.generate(
                chat_ml_sample=ChatMLSample(messages=messages),
                max_new_tokens=1024,
                temperature=temperature,
                top_p=0.95,
                top_k=50,
                stop_strings=["<|end_of_text|>", "<|eot_id|>"],
            )
            
            # 오디오 데이터를 base64로 인코딩
            audio_data = output.audio
            sampling_rate = output.sampling_rate
            
            # 메타데이터 반환
            return {
                "audio": audio_data.tolist(),
                "sampling_rate": sampling_rate,
                "duration": len(audio_data) / sampling_rate,
                "text": text,
                "voice_style": voice_style,
                "model": MODEL_PATH
            }
            
        except Exception as e:
            print(f"음성 생성 중 오류 발생: {e}")
            return {
                "error": str(e),
                "text": text,
                "voice_style": voice_style
            }

# Replicate에서 사용할 예측 함수
def predict(text: str, voice_style: str = "따뜻하게", temperature: float = 0.3) -> Dict[str, Any]:
    """
    Replicate에서 호출되는 메인 함수
    
    Args:
        text: 변환할 텍스트
        voice_style: 음성 스타일
        temperature: 생성 온도
    
    Returns:
        음성 데이터와 메타데이터
    """
    predictor = Predictor()
    return predictor.predict(text, voice_style, temperature)
