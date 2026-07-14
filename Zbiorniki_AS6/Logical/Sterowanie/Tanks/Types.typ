
TYPE
	Recipe : 	STRUCT 
		ZaworPrawy : INT := 100;
		ZaworLewy : INT := 100;
		NapelnienieZb2 : INT := 8000;
		NapelnienieZb3 : INT := 9000;
		NapelnienieZb1 : INT := 8000;
		Mix : BOOL := TRUE;
	END_STRUCT;
	StanZb : 
		(
		Stop,
		TrybManual,
		NapelnianieZb12,
		NapelnianieZb3,
		Mieszanie,
		OproznianieZb3
		);
END_TYPE
