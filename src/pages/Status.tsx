import "./styles/Status.style.scss";
import { Helmet } from "react-helmet";
import type { StudentInfo } from "@/apis/types";
import { CButton, CustomForm, type InputValueType } from "@/components/_common";
import { ROUTE_PATH } from "@/routes";
import { RenderResultController } from "@/components/Status/result";
import { RenderInventoryController } from "@/components/Status/inventory";
import { useUserInfo } from "@/contexts/UserInfoContext";
import { useFetch } from "@/hooks/useFetch";

const Status = () => {
  const { handleUserInfo } = useUserInfo();
  const {
    data: result,
    error,
    isLoading,
    fetchData,
  } = useFetch<StudentInfo>({
    action: "getstudentinfo",
  });

  const submitCallback = async (value?: InputValueType) => {
    if (!value) return;
    await fetchData(`name=${value.name}&phone=${value.phone}`);
    handleUserInfo({ goldLeft: result?.goldLeft || 0 });
  };
  return (
    <>
      <Helmet>
        <meta name="description" content="This is the status page." />
        <title>파밍 대시보드</title>
      </Helmet>
      <div className="form-container">
        <h2>⛏️ 파밍을 얼마나 열심히 했는지 볼 수 있는 곳 👩🏻‍🌾</h2>
        <CustomForm submitCallback={submitCallback} />
      </div>

      <div className="result-container">
        <div id="result" className="result">
          노가다의 흔적...
          <RenderResultController
            isLoading={isLoading}
            error={error}
            result={result}
          />
        </div>
        <div id="inventory" className="inventory">
          인벤토리
          <RenderInventoryController
            isLoading={isLoading}
            error={error}
            result={result}
          />
        </div>
      </div>
      <CButton mode="link" to={ROUTE_PATH.ROOT} className="back-home">
        🏠 메인으로 돌아가기
      </CButton>
    </>
  );
};

export default Status;
