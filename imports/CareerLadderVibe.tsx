import imgImage3 from "figma:asset/c765e11b3a830b70a0f0503b4ea02344188bec27.png";

function Heading() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[24px] left-[178.26px] not-italic text-[#1f1f1f] text-[16px] text-center text-nowrap top-[0.8px] translate-x-[-50%] whitespace-pre">Career Ladder</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Figtree:Regular',sans-serif] font-normal leading-[21px] left-[178.33px] text-[#6b6f76] text-[14px] text-center text-nowrap top-[-0.4px] translate-x-[-50%] whitespace-pre">Sign in to your account</p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[100.6px] items-center justify-end relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex gap-[8px] h-[18px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#676879] text-[12px] text-nowrap whitespace-pre">Email</p>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[44px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[44px] items-center px-[16px] py-[12px] relative w-full">
          <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#6b6f76] text-[14px] text-nowrap whitespace-pre">you@example.com</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#d0d4da] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[62px] relative shrink-0 w-[356px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[62px] items-start relative w-[356px]">
        <PrimitiveLabel />
        <Input />
      </div>
    </div>
  );
}

function PrimitiveLabel1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[18px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#676879] text-[12px] text-nowrap whitespace-pre">Password</p>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white h-[44px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[44px] items-center px-[16px] py-[12px] relative w-full">
          <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#6b6f76] text-[14px] text-nowrap whitespace-pre">••••••••</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#d0d4da] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[356px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-full items-start relative w-[356px]">
        <PrimitiveLabel1 />
        <Input1 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#0073ea] h-[44px] relative rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] shrink-0 w-[356px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[44px] items-center justify-center px-[20px] py-[12px] relative w-[356px]">
        <p className="font-['Figtree:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">Sign In</p>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[200px] items-start relative shrink-0 w-full" data-name="Form">
      <Container1 />
      <Container2 />
      <Button />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[21px] left-[229.5px] top-0 w-[47.425px]" data-name="Button">
      <p className="[text-underline-position:from-font] absolute decoration-solid font-['Figtree:Regular',sans-serif] font-normal leading-[21px] left-[24px] text-[#6b6f76] text-[14px] text-center text-nowrap top-[-0.4px] translate-x-[-50%] underline whitespace-pre">Sign up</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Figtree:Regular',sans-serif] font-normal leading-[21px] left-[154.56px] text-[#6b6f76] text-[14px] text-center top-[-0.4px] translate-x-[-50%] w-[151px]">{`Don't have an account?`}</p>
      <Button1 />
    </div>
  );
}

function AuthCard() {
  return (
    <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-col gap-[24px] h-[433.6px] items-start pb-0 pt-[32px] px-[32px] relative shrink-0" data-name="AuthCard">
      <Container />
      <Form />
      <Container3 />
    </div>
  );
}

function Frame() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[10px] grow h-full items-center justify-center min-h-px min-w-px relative shrink-0">
      <AuthCard />
    </div>
  );
}

function App() {
  return (
    <div className="basis-0 bg-white content-stretch flex grow items-center justify-center min-h-px min-w-px relative shrink-0 w-full" data-name="App">
      <Frame />
      <div className="aspect-[582/810] basis-0 grow min-h-px min-w-px relative shrink-0" data-name="image 3">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage3} />
      </div>
    </div>
  );
}

export default function CareerLadderVibe() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[10px] items-start relative size-full" data-name="Career Ladder- Vibe">
      <App />
    </div>
  );
}