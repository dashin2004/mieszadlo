
PROGRAM _INIT
	gZb1_poziom;
	gZb1_zawor;
	gZb2_poziom;
	gZb2_zawor;
	
	gZb3_poziom;
	gZb3_zawor_glowny;
	gZb3_zawor_lewy;
	gZb3_zawor_prawy;
	
	gMieszadlo;
	MpAlarmXCore_0.Enable := TRUE; 
	MpAlarmXCore_0.MpLink := ADR(gAlarmXCore); 
	 
	MpAlarmXHistory_0.Enable := TRUE; 
	MpAlarmXHistory_0.MpLink := ADR(gAlarmXHistory); 
	MpAlarmXHistory_0.FileName := ADR('Alarms_%Y_%m_%d_%H_%M_%S'); 
	MpAlarmXHistory_0.DeviceName := ADR('CF'); 
	 
	MpAlarmXCore_0(); 
	MpAlarmXHistory_0(); 
	 
END_PROGRAM

PROGRAM _CYCLIC
	
	
	IF StopBtn=TRUE THEN
		StopStan:='STOP = TRUE';
	ELSE
		StopStan:='STOP = FALSE';
	END_IF;
	IF Start=TRUE THEN
		StartStan:='START = TRUE';
	ELSE
		StartStan:='START = FALSE';
	END_IF;
	IF StopBtn=TRUE THEN
		Maszyna:=Stop;
		
	END_IF
	IF TrybPracy = TRUE THEN
		TrybPracyStr:='MANUAL';
	ELSE 
		TrybPracyStr:='AUTO';
	END_IF
	IF MieszanieBtn=TRUE THEN
		MieszanieStr:='Mieszanie = TRUE';
	ELSE
		MieszanieStr:='Mieszanie = FALSE';
	END_IF
	
		
	TON_0(IN :=gMieszadlo , PT := T#5s);
	CASE Maszyna OF
		Stop:
			KrokMaszyny:='Stop';
			gZb1_zawor:=FALSE;
			gZb2_zawor:=FALSE;
			gZb3_zawor_glowny:=FALSE;
			gZb3_zawor_lewy:=0;
			gZb3_zawor_prawy:=0;
			IF Start=TRUE AND StopBtn=FALSE AND TrybPracy=FALSE THEN
				Maszyna:=NapelnianieZb12;
			ELSIF StopBtn=FALSE AND TrybPracy=TRUE THEN
				Maszyna:=TrybManual;
			END_IF
		TrybManual:
			KrokMaszyny:='Tryb Manual';
			gZb1_zawor:=Zb1_zawor_view;
			gZb2_zawor:=Zb2_zawor_view;
			gZb3_zawor_glowny:=Zb3_zawor_glowny_view;
			gZb3_zawor_lewy:=Zb3_zawor_lewy_view;
			gZb3_zawor_prawy:=Zb3_zawor_prawy_view;
			IF TrybPracy=FALSE THEN
				Maszyna:=Stop;
			END_IF
			
			
			
		NapelnianieZb12:
			KrokMaszyny:='Napelnianie zbiorników 1 i 2';
			IF gZb1_poziom<8000 THEN
				gZb1_zawor:=TRUE;
			ELSE 
				gZb1_zawor:=FALSE;
			END_IF
			IF gZb2_poziom<8000 THEN
				gZb2_zawor:=TRUE;
			ELSE 
				gZb2_zawor:=FALSE;
			END_IF
			IF gZb1_poziom >=8000 AND gZb2_poziom >=8000 THEN
				Maszyna:=NapelnianieZb3;
			END_IF			
		NapelnianieZb3:
			KrokMaszyny:='Napelnianie zbiornika 3';
			IF gZb3_poziom<9000 THEN
				gZb3_zawor_lewy:=100;
				gZb3_zawor_prawy:=100;
			ELSE
				gZb3_zawor_lewy:=0;
				gZb3_zawor_prawy:=0;
				IF MieszanieBtn=FALSE THEN
					Maszyna:=OproznianieZb3;
				ELSE
					Maszyna:=Mieszanie;
				END_IF
				
			END_IF;
		Mieszanie:
			KrokMaszyny:='Mieszanie';
			gMieszadlo:=TRUE;

			IF TON_0.Q=TRUE THEN
				gMieszadlo:=FALSE;
				test:=TRUE;
				Maszyna:=OproznianieZb3;
			END_IF
			
		OproznianieZb3:
			KrokMaszyny:='Oproznianie zbiornika 3';
			IF gZb3_poziom >0 THEN
				gZb3_zawor_glowny:=TRUE;
			ELSE
				gZb3_zawor_glowny:=FALSE;
				Maszyna:=Stop;
			END_IF
		
	END_CASE
	
	MpAlarmXCore_0(); 
	MpAlarmXHistory_0(); 
	 
END_PROGRAM

PROGRAM _EXIT

	 
END_PROGRAM

