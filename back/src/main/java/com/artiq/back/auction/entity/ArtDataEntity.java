package com.artiq.back.auction.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "auction_data")
public class ArtDataEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int artId;


    @Column(name = "data_type")
    private String prdct_cl_nm;

    @Column(name = "data_year")
    private String manage_no_year;
    
    @Column(name = "data_name")
    private String prdct_nm_korean;

    @Column(name = "data_size") 
    private String prdct_stndrd;
    
    @Column(name = "data_technique")
    private String matrl_technic;

    @Column(name = "data_wirter") 
    private String writr_nm; 

    @Column(name = "data_image")
    private String main_image; 
  
; 

    //엔터티는 기본생성자가 꼭 필요함 (의존성 주입 해야하니까)
    public ArtDataEntity() {

    }

  
}