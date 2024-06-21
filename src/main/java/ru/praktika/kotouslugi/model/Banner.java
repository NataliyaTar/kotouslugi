package ru.praktika.kotouslugi.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "banner")
public class Banner {
    @Id
    @GeneratedValue
    private Long id;
    private String bg;
    private String title;
    private String text;
    private String imgurl;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBg() {
        return bg;
    }

    public void setBg(String bg) {
        this.bg = bg;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) { this.title = title; }

    public String getText() { return this.text; }

    public void setText(String text) { this.text = text; }

    public String getImgUrl() { return this.imgurl; }

    public void setImgUrl(String imgUrl) { this.imgurl = imgUrl; }

}
