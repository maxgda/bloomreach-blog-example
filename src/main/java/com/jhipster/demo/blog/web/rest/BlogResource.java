package com.jhipster.demo.blog.web.rest;

import com.jhipster.demo.blog.domain.Post;
import com.jhipster.demo.blog.domain.enumeration.PublicationStatus;
import com.jhipster.demo.blog.service.PostQueryService;
import com.jhipster.demo.blog.service.criteria.PostCriteria;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.PaginationUtil;

@RestController
@RequestMapping("/api")
public class BlogResource {

    private final Logger log = LoggerFactory.getLogger(BlogResource.class);
    private final PostQueryService postQueryService;

    public BlogResource(PostQueryService postQueryService) {
        this.postQueryService = postQueryService;
    }

    @GetMapping("blog/published")
    public ResponseEntity<List<Post>> getAllPublishedPosts(Pageable pageable) {
        log.debug("REST request to get published Posts");
        Page<Post> page = postQueryService.findByCriteria(createStatusCriteria(PublicationStatus.PUBLISHED), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("blog/unpublished")
    public ResponseEntity<List<Post>> getAllUnpublishedPosts(Pageable pageable) {
        log.debug("REST request to get unpublished Posts");
        Page<Post> page = postQueryService.findByCriteria(createStatusCriteria(PublicationStatus.UNPUBLISHED), pageable);
        return getAllPosts(page);
    }

    private ResponseEntity<List<Post>> getAllPosts(Page<Post> page) {
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    public PostCriteria createStatusCriteria(PublicationStatus status) {
        PostCriteria.PublicationStatusFilter filter = new PostCriteria.PublicationStatusFilter();
        filter.setEquals(status);
        PostCriteria criteria = new PostCriteria();
        criteria.setStatus(filter);
        return criteria;
    }
}
