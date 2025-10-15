import "./styles/Landing.style.scss";
import type { StudentInfo } from "@/apis/types";
import { ROUTE_PATH } from "@/routes";
import { useModal } from "@/contexts/ModalContext";
import { CButton, CustomForm, type InputValueType } from "@/components/_common";
import { useFetch } from "@/hooks/useFetch";
import { useUserInfo } from "@/contexts/UserInfoContext";

const Landing = () => {
  const modal = useModal();
  const { userInfo } = useUserInfo();
  const navigate = useNavigate();
  const { fetchData } = useFetch({ action: "getstudentinfo" });
  const entranceStore = () => {
    if (!userInfo.name || !userInfo.phone) {
      modal.open({
        id: "store-entrance",
        title: "상점 입장",
        content: <StoreEntrance />,
        mode: "no-btn",
      });
    } else {
      navigate(ROUTE_PATH.STORE);
    }
  };

  useEffect(() => {
    if (userInfo.name && userInfo.phone) {
      const fetchUserInfo = async () => {
        const data = await fetchData(
          `name=${userInfo.name}&phone=${userInfo.phone}`
        );
        if (data) {
          // Update only goldLeft to avoid overwriting name and phone
          userInfo.goldLeft = data.goldLeft;
        }
        fetchUserInfo();
      };
    }
  }, []);

  return (
    <main className="container">
      <CButton className="menuBtn" mode="link" to={ROUTE_PATH.STATUS}>
        🔍 플레이어 상태 <br /> 확인하기
      </CButton>
      <CButton className="menuBtn" mode="link" to={ROUTE_PATH.RANKING}>
        🏆 랭킹보기
      </CButton>
      <CButton className="menuBtn" mode="default" onClick={entranceStore}>
        🛒 상점가기
      </CButton>
    </main>
  );
};

const StoreEntrance = () => {
  const modal = useModal();
  const { handleUserInfo } = useUserInfo();
  const { isLoading, error, fetchData } = useFetch<StudentInfo>({
    action: "getstudentinfo",
  });
  const navigate = useNavigate();
  const submitCallback = async (value?: InputValueType) => {
    const data = await fetchData(`name=${value?.name}&phone=${value?.phone}`);
    handleUserInfo({
      goldLeft: data?.goldLeft,
    });

    modal.close("store-entrance");
    navigate(ROUTE_PATH.STORE);
  };
  return (
    <div className="store-entrance">
      {isLoading && <p>로딩중...</p>}
      {error && <p>에러가 발생했습니다. 다시 시도해주세요.</p>}

      <CButton
        className="menuBtn close-btn"
        mode="outline"
        disabled={isLoading}
        onClick={() => modal.close("store-entrance")}
      >
        X
      </CButton>

      <CustomForm submitCallback={submitCallback} />
    </div>
  );
};

export default Landing;
