# predict.py
from cog import BasePredictor, Input, Path
import torch
from boson_multimodal.serve.serve_engine import HiggsAudioServeEngine, HiggsAudioResponse
from boson_multimodal.data_types import ChatMLSample, Message

MODEL_PATH = "bosonai/higgs-audio-v2-generation-3B-base"
AUDIO_TOKENIZER_PATH = "bosonai/higgs-audio-v2-tokenizer"

class Predictor(BasePredictor):
    def setup(self):
        """모델을 메모리에 로드하는 부분"""
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.serve_engine = HiggsAudioServeEngine(MODEL_PATH, AUDIO_TOKENIZER_PATH, device=self.device)

    def predict(
        self,
        text: str = Input(description="음성으로 변환할 텍스트"),
        scene_description: str = Input(
            description="오디오의 분위기나 배경 설명",
            default="Audio is recorded from a quiet room."
        )
    ) -> Path:
        """API 요청이 오면 실제 음성을 생성하는 부분"""
        system_prompt = f"Generate audio following instruction.\n\n<|scene_desc_start|>\n{scene_description}\n<|scene_desc_end|>"
        messages = [
            Message(role="system", content=system_prompt),
            Message(role="user", content=text),
        ]

        output: HiggsAudioResponse = self.serve_engine.generate(
            chat_ml_sample=ChatMLSample(messages=messages),
            max_new_tokens=1024,
            temperature=0.3,
        )

        out_path = "/tmp/output.wav"
        torch.save(torch.from_numpy(output.audio)[None, :], out_path)
        # torchaudio.save 대체

        return Path(out_path)
